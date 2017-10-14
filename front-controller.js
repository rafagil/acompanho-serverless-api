const Log = require('./util/log.util');
function error405() {
  return { status: 405, body: "Method not allowed" }
}

function getResponse(controller, req, context, method) {
  if (controller[method]) {
    return controller[method](req, context);
  }
  return error405();
}

module.exports = (controller) => {
  return (context, req) => {
    let res = null;
    Log.setLogger(context.log);
    switch (req.method) {
      case "POST":
        if (req.params.id)
          res = error405(); //Não pode adicionar em um recurso
        else
          res = getResponse(controller, req, context, 'create');
        break;
      case "PUT":
        if (req.params.id)
          res = getResponse(controller, req, context, 'update');
        else
          res = error405(); // Não pode atualizar sem id
        break;
      case "DELETE":
        if (req.params.id)
          res = getResponse(controller, req, context, 'remove');
        else
          res = error405(); //Não pode deletar sem id
        break;
      case "GET":
        if (req.params.id)
          res = getResponse(controller, req, context, 'find');
        else
          res = getResponse(controller, req, context, 'list');
        break;
    }
    if (res.then) {
      res.then((res) => {
        context.res = res.status ? { status: res.status, body: res.body } : { body: res };
        context.done();
      });
      res.catch((e) => {
        context.res = { status: 500, body: { error: e } }
        context.done();
      });
    } else {
      context.res = res.status ? { status: res.status, body: res.body } : { body: res };
      context.done();
    }
  };
}
