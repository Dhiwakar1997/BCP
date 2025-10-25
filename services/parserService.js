class ParserService {

    async GS1(barcode){
        tempBarcode = barcode;
   
    }

    async HIBC(barcode1,barcode2) {

        const ItemNum = await this.HIBC_primary_parser(barcode1)
        const {ExpDateStr, LotNumber, SerialNumber} = await this.HIBC_secondary_parser(barcode2)

        return {"item_number":ItemNum,"expiry_date":ExpDateStr,"lot_number":LotNumber,"serial_number":SerialNumber,}
    }
    async HIBC_primary_parser(barcodeString) {

        const itemNumberPattern = /\+[A-Za-z][A-Za-z0-9]{3}([A-Za-z0-9]{1,18})../;
        const itemNumberMatch = typeof barcodeString === 'string' ? barcodeString.match(itemNumberPattern) : null;
        if (itemNumberMatch) {
            return itemNumberMatch[1] ;
        }
        return "";
    }

    async HIBC_secondary_parser(barcodeString) {

        var LotNumber="", SerialNumber="", ExpDateStr="",LotSnPtn = "";

        if (typeof barcodeString !== 'string') return {};
        const result = {};

        const LotNumPtn = /(\+\$\$(?<MMYY>(0[0-9]|1[0-2])[0-9]{2})(?<lot>.{0,13})..|\+\$\$2(?<MMDDYY>(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])[0-9]{2})(?<lot>.{0,13})..|\+\$\$3(?<YYMMDD>([0-9]{2})(0[0-9]|1[0-2])([0-2][0-9]|3[0-1]))(?<lot>.{0,13})..|\+\$\$4(?<YYMMDDHH>([0-9]{2})(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])([0-1][0-9]|2[0-4]))(?<lot>.{0,13})..|\+\$\$5(?<YYJJJ>(?<yy>[0-9]{2})(?<jjj>[0-2][0-9][0-9]|3[0-6][0-9]))(?<lot>.{0,13})..|\+\$\$6(?<YYJJJHH>(?<yy>[0-9]{2})(?<jjj>[0-2][0-9][0-9]|3[0-6][0-9])(?<hh>[0-1][0-9]|2[0-4]))(?<lot>.{0,13})..|(\+\$\$7|\+\$)(?<lot>.{0,13})..)/

        const SN_Ptn =/(\+\$\$\+(?<MMYY>(0[0-9]|1[0-2])[0-9]{2})(?<SN>.{0,13})..|\+\$\$\+2(?<MMDDYY>(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])[0-9]{2})(?<SN>.{0,13})..|\+\$\$\+3(?<YYMMDD>([0-9]{2})(0[0-9]|1[0-2])([0-2][0-9]|3[0-1]))(?<SN>.{0,13})..|\+\$\$\+4(?<YYMMDDHH>([0-9]{2})(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])([0-1][0-9]|2[0-4]))(?<SN>.{0,13})..|\+\$\$\+5(?<YYJJJ>(?<yy>[0-9]{2})(?<jjj>[0-2][0-9][0-9]|3[0-6][0-9]))(?<SN>.{0,13})..|\+\$\$\+6(?<YYJJJHH>(?<yy>[0-9]{2})(?<jjj>[0-2][0-9][0-9]|3[0-6][0-9])(?<hh>[0-1][0-9]|2[0-4]))(?<SN>.{0,13})..|(\+\$\$\+7|\+\$\+)(?<SN>.{0,13})..)/

        if (barcodeString.startsWith("+$$+") || barcodeString.startsWith("+$+")){
         LotSnPtn = SN_Ptn
        }
        else{
         LotSnPtn = LotNumPtn       
        }

        const rx = new RegExp(LotSnPtn);
        const match = barcodeString.match(rx);

        if (!match) {
            return {};
        }

        const groups = match.groups || {};

        if (groups.lot) {
             LotNumber = groups.lot;
        } else if (groups.SN) {
             SerialNumber = groups.SN;
        }

        const setExpDateAndStr = (date) => {
            const ExpDate = date;
            const y = date.getUTCFullYear();
            const m = String(date.getUTCMonth() + 1).padStart(2, '0');
            const d = String(date.getUTCDate()).padStart(2, '0');
            const ExpDateStrParam = `${y}-${m}-${d}`;

            return ExpDateStrParam
        };


        if (groups.YYJJJ && groups.yy && groups.jjj) {
            const yy = parseInt(groups.yy, 10);
            const jjj = parseInt(groups.jjj, 10);
            const year = 2000 + yy;
            const dayIndex = jjj - 1;
            const start = new Date(Date.UTC(year, 0, 1));
            ExpDateStr = setExpDateAndStr(new Date(start.getTime() + dayIndex * 86400000));
        } else if (groups.YYJJJHH && groups.yy && groups.jjj && groups.hh) {
            const yy = parseInt(groups.yy, 10);
            const jjj = parseInt(groups.jjj, 10);
            const hh = parseInt(groups.hh, 10);
            const year = 2000 + yy;
            const dayIndex = jjj - 1;
            const start = new Date(Date.UTC(year, 0, 1, hh));
            ExpDateStr = setExpDateAndStr(new Date(start.getTime() + dayIndex * 86400000));
        } else if (groups.MMYY) {
            const mm = parseInt(groups.MMYY.slice(0, 2), 10);
            const yy = parseInt(groups.MMYY.slice(2, 4), 10);
            const year = 2000 + yy;
            ExpDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, 1)));
        } else if (groups.MMDDYY) {
            const mm = parseInt(groups.MMDDYY.slice(0, 2), 10);
            const dd = parseInt(groups.MMDDYY.slice(2, 4), 10);
            const yy = parseInt(groups.MMDDYY.slice(4, 6), 10);
            const year = 2000 + yy;
            ExpDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, dd)));
        } else if (groups.YYMMDD) {
            const yy = parseInt(groups.YYMMDD.slice(0, 2), 10);
            const mm = parseInt(groups.YYMMDD.slice(2, 4), 10);
            const dd = parseInt(groups.YYMMDD.slice(4, 6), 10);
            const year = 2000 + yy;
            ExpDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, dd)));
        } else if (groups.YYMMDDHH) {
            const yy = parseInt(groups.YYMMDDHH.slice(0, 2), 10);
            const mm = parseInt(groups.YYMMDDHH.slice(2, 4), 10);
            const dd = parseInt(groups.YYMMDDHH.slice(4, 6), 10);
            const hh = parseInt(groups.YYMMDDHH.slice(6, 8), 10);
            const year = 2000 + yy;
            ExpDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, dd, hh)));
        } else if (groups.JJJ && groups.YY) {
            const yy = parseInt(groups.YY, 10);
            const jjj = parseInt(groups.JJJ, 10);
            const year = 2000 + yy;
            const dayIndex = jjj - 1;
            const start = new Date(Date.UTC(year, 0, 1));
            ExpDateStr = setExpDateAndStr(new Date(start.getTime() + dayIndex * 86400000));
        }

        return {ExpDateStr,LotNumber, SerialNumber} 

    }

    async EAN_13(barcode){

        const pattern = /([0-9]{3})([0-9]{4})([0-9]{5})([0-9])/;
        const match = typeof barcode === 'string' ? barcode.match(pattern) : null;

        if (!match) {
            return null;
        }
        return {
            country_code: match[1],
            manufacturer_code: match[2],
            product_code: match[3],
            check_digit: match[4]
        };
    }


}

module.exports = ParserService;