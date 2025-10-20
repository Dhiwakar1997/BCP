const ParserService = require("../services/parserService")

class ParserController {

  parser(req, res) {
    res.json({ message: "This parser can parse GS1, HIBC and EAN_13 data" });
  }
  GS1_parser(req, res) {
    res.json({ message: "Returning all GS1 data" });
  }
  async HIBC_parser(req, res) {
    const { barcode1, barcode2 } = req.body;
    const parserService = new ParserService();
    const result = await parserService.HIBC(barcode1,barcode2)
    res.json(result);
  }
  async EAN_13_parser(req, res) {
    const { barcode } = req.body;

    const parserService = new ParserService();
    const result = await parserService.EAN_13(barcode);

    res.json(result);
  }
}

// Export an instance (singleton)
module.exports = new ParserController();
