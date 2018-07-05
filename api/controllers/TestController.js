/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  isOk: (req, res) => {

    return ResponseService.json(200, res, "Server is ok.")

  },
};

