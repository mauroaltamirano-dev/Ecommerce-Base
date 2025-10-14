import CustomRouter from "../../helpers/CustomRouter.helper.js";
import { usersController } from "../../controllers/controller.js";

class UsersRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/", ["PUBLIC"], usersController.createOne);
    this.read("/", ["PUBLIC"], usersController.readAll);
    this.read("/:id", ["USER", "ADMIN"], usersController.readById);
    this.update("/:id", ["USER", "ADMIN"], usersController.updateById);
    this.destroy("/:id", ["USER", "ADMIN"], usersController.destroyById);
  };
}

const usersRouter = new UsersRouter();

export default usersRouter.getRouter();
