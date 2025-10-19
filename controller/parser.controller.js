  class ParserController {
    parser(req, res) {
      res.json({ message: "This parser can parse GS1, HIBC and EAN_13 data" });
    }
    GS1_parser(req, res) {
      res.json({ message: "Returning all GS1 data" });
    }
    HIBC_parser(req, res) {
        res.json({ message: "Returning all HIBC data" });
      }
      EAN_13_parser(req, res) {
        res.json({ message: "Returning all EAN_13 data" });
      }

  }
  
  // Export an instance (singleton)
  module.exports = new ParserController();
  