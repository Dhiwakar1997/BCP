class ParserService {
    constructor() {
        const parsedData = {
            itemNumber: null,
            primaryBarcode: null,
            secondaryBarcode: null,
            lotNumber: null,
            serialNumber: null,
            lotSerialFlag: null,
            mfgDate: null,
            mfgDateStr: null,
            expDate: null,
            expDateStr: null,
            isPartiallyParsed: false,
            isFullyParsed: false
        };
        this.parsedData = parsedData
    }
    async GS1(barcode){
        if(barcode.match(/\x1D/))
        {
            //TODO: Need to craete a function for GS1 with GS
            await this.GS1_without_GS(barcode)
        }
        else{
            await this.GS1_without_GS(barcode)
        }


        return {
            item_number: this.parsedData.itemNumber,
            manufacture_date: this.parsedData.mfgDateStr,
            expiry_date: this.parsedData.expDateStr,
            lot_number: this.parsedData.lotNumber,
            serial_number: this.parsedData.serialNumber
        }
       }

    async GS1_without_GS(barcode) {
        if (!barcode || typeof barcode !== 'string') {
            return {
                success: false,
                message: "Invalid barcode"
            };
        }

        let barcodeString = barcode;


        // Item Number Pattern matching
        const itemNumberPattern = /^01([0-9]{14})(?=$|10|21|17|11|9\d|\x1D)/;
        const itemNumberMatch = barcodeString.match(itemNumberPattern);

        if (itemNumberMatch) {
            this.parsedData.itemNumber = itemNumberMatch[1];
            this.parsedData.primaryBarcode = "01" + this.parsedData.itemNumber;
            barcodeString = barcodeString.replace(itemNumberPattern, "");
            this.parsedData.secondaryBarcode = barcodeString;
            
            if (barcodeString.length === 0) {
                this.parsedData.isPartiallyParsed = true;
                return {
                    success: true,
                    ...parsedData
                };
            }
        } else {
            return {
                success: false,
                message: "Item Number not found",
                ...parsedData
            };
        }

        // Extract Manufacturing and Expiry dates
        barcodeString = this._manNdExpDateExtract(barcodeString);

        // Lot/Serial Number Pattern matching
        const lot_SN_Pattern = /((10|21)([\x21-\x22\x25-\x2F\x30-\x39\x3A-\x3F\x41-\x5A\x5F\x61-\x7A]{0,20}))\x1D?/;
        const lot_SN_Match = barcodeString.match(lot_SN_Pattern);

        if (lot_SN_Match) {
            const LotOrSN = lot_SN_Match[2];
            if (LotOrSN === "10") {
                this.parsedData.lotNumber = lot_SN_Match[3];
                this.parsedData.lotSerialFlag = "L";
            } else if (LotOrSN === "21") {
                this.parsedData.serialNumber = lot_SN_Match[3];
                this.parsedData.lotSerialFlag = "S";
            }
            barcodeString = barcodeString.replace(lot_SN_Pattern, "");
        }

        // Check if fully parsed
        if (this.parsedData.itemNumber && (this.parsedData.lotNumber || this.parsedData.serialNumber)) {
            this.parsedData.isFullyParsed = true;
            return {
                success: true,
                message: "Pattern matched",
                ...this.parsedData
            };
        } else {
            return {
                success: false,
                message: "Pattern unmatched",
                ...this.parsedData
            };
        }
    }

    _manNdExpDateExtract(barcodeString) {
        let resultString = barcodeString;
        
        for (let i = 0; i < 2; i++) {
            const manNdExpDatePtn = /(^((17|11)(([0-9]{2})(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])))(?:.*(?:21|10).{1,20})|(?:.*(?:21|10).{1,20})((17|11)(([0-9]{2})(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])))$)/;
            const manNdExpDateMatch = resultString.match(manNdExpDatePtn);

            if (manNdExpDateMatch) {
                if (manNdExpDateMatch[2]) {
                    const dateCode = manNdExpDateMatch[3];
                    const dateValue = manNdExpDateMatch[4];
                    
                    if (dateCode === "11") {
                        const parsedDate = this._convertYearTo21stCentury(dateValue);
                        this.parsedData.mfgDate = parsedDate;
                        this.parsedData.mfgDateStr = this._formatDate(parsedDate);
                    } else if (dateCode === "17") {
                        const parsedDate = this._convertYearTo21stCentury(dateValue);
                        this.parsedData.expDate = parsedDate;
                        this.parsedData.expDateStr = this._formatDate(parsedDate);
                    }
                    
                    // Replace the matched group (literal string replacement)
                    resultString = resultString.replace(manNdExpDateMatch[2], "");
                } else if (manNdExpDateMatch[8]) {
                    const dateCode = manNdExpDateMatch[9];
                    const dateValue = manNdExpDateMatch[10];
                    
                    if (dateCode === "11") {
                        const parsedDate = this._convertYearTo21stCentury(dateValue);
                        this.parsedData.mfgDate = parsedDate;
                        this.parsedData.mfgDateStr = this._formatDate(parsedDate);
                    } else if (dateCode === "17") {
                        const parsedDate = this._convertYearTo21stCentury(dateValue);
                        this.parsedData.expDate = parsedDate;
                        this.parsedData.expDateStr = this._formatDate(parsedDate);
                    }
                    
                    // Escape special regex characters and replace the matched group
                    const toReplace = manNdExpDateMatch[8].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    resultString = resultString.replace(new RegExp(toReplace), "");
                }
            }
        }
        
        return resultString;
    }

    _convertYearTo21stCentury(dateString) {
        // dateString format: yyMMdd
        const yy = parseInt(dateString.substring(0, 2), 10);
        const mm = parseInt(dateString.substring(2, 4), 10) - 1; // JavaScript months are 0-indexed
        const dd = parseInt(dateString.substring(4, 6), 10);
        
        // Convert 2-digit year to 21st century (2000-2099)
        const year = yy >= 0 && yy <= 99 ? 2000 + yy : yy;
        
        return new Date(year, mm, dd);
    }

    _formatDate(date) {
        if (!date || !(date instanceof Date)) {
            return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async HIBC(barcode1,barcode2) {

        await this.HIBC_primary_parser(barcode1)
        await this.HIBC_secondary_parser(barcode2)

        console.log(this.parsedData)
        return {
            item_number: this.parsedData.itemNumber,
            expiry_date: this.parsedData.expDateStr,
            lot_number: this.parsedData.lotNumber,
            serial_number: this.parsedData.serialNumber
        }
    }
    async HIBC_primary_parser(barcodeString) {

        const itemNumberPattern = /\+[A-Za-z][A-Za-z0-9]{3}([A-Za-z0-9]{1,18})../;
        const itemNumberMatch = typeof barcodeString === 'string' ? barcodeString.match(itemNumberPattern) : null;

        if (itemNumberMatch) {
            this.parsedData.itemNumber = itemNumberMatch[1];
        }
    }

    async HIBC_secondary_parser(barcodeString) {

        this.parsedData = this.parsedData || {};
        var LotSnPtn = "";

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
            this.parsedData.lotNumber = groups.lot;
        } else if (groups.SN) {
             this.parsedData.serialNumber = groups.SN;
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
            this.parsedData.expDateStr = setExpDateAndStr(new Date(start.getTime() + dayIndex * 86400000));
        } else if (groups.YYJJJHH && groups.yy && groups.jjj && groups.hh) {
            const yy = parseInt(groups.yy, 10);
            const jjj = parseInt(groups.jjj, 10);
            const hh = parseInt(groups.hh, 10);
            const year = 2000 + yy;
            const dayIndex = jjj - 1;
            const start = new Date(Date.UTC(year, 0, 1, hh));
            this.parsedData.expDateStr = setExpDateAndStr(new Date(start.getTime() + dayIndex * 86400000));
        } else if (groups.MMYY) {
            const mm = parseInt(groups.MMYY.slice(0, 2), 10);
            const yy = parseInt(groups.MMYY.slice(2, 4), 10);
            const year = 2000 + yy;
            this.parsedData.expDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, 1)));
        } else if (groups.MMDDYY) {
            const mm = parseInt(groups.MMDDYY.slice(0, 2), 10);
            const dd = parseInt(groups.MMDDYY.slice(2, 4), 10);
            const yy = parseInt(groups.MMDDYY.slice(4, 6), 10);
            const year = 2000 + yy;
            this.parsedData.expDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, dd)));
        } else if (groups.YYMMDD) {
            const yy = parseInt(groups.YYMMDD.slice(0, 2), 10);
            const mm = parseInt(groups.YYMMDD.slice(2, 4), 10);
            const dd = parseInt(groups.YYMMDD.slice(4, 6), 10);
            const year = 2000 + yy;
            this.parsedData.expDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, dd)));
        } else if (groups.YYMMDDHH) {
            const yy = parseInt(groups.YYMMDDHH.slice(0, 2), 10);
            const mm = parseInt(groups.YYMMDDHH.slice(2, 4), 10);
            const dd = parseInt(groups.YYMMDDHH.slice(4, 6), 10);
            const hh = parseInt(groups.YYMMDDHH.slice(6, 8), 10);
            const year = 2000 + yy;
            this.parsedData.expDateStr = setExpDateAndStr(new Date(Date.UTC(year, mm - 1, dd, hh)));
        } else if (groups.JJJ && groups.YY) {
            const yy = parseInt(groups.YY, 10);
            const jjj = parseInt(groups.JJJ, 10);
            const year = 2000 + yy;
            const dayIndex = jjj - 1;
            const start = new Date(Date.UTC(year, 0, 1));
            this.parsedData.expDateStr = setExpDateAndStr(new Date(start.getTime() + dayIndex * 86400000));
        }
        console.log(this.parsedData)
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