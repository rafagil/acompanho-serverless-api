module.exports = class Log {
  static setLogger(logger){
    Log.logger = logger;
  }
  static log(text){
    Log.log(text);
  }
}