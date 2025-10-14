import { parse } from "dotenv";
import CustomRouter from "../../helpers/CustomRouter.helper.js";
import createMockProduct from "../../helpers/mocks/products.mock.js";
import createMockUser from "../../helpers/mocks/users.mock.js";
import setResponses from "../../middlewares/setResponses.mid.js";
import {
  productsServices,
  usersService,
} from "../../services/products.services.js";

const generateMockUsers = async (count) => {
  for (let i = 0; i < count; i++) {
    const one = createMockUser();
    await usersService.createOne(one);
  }
};

const generateMockProducts = async (count) => {
  for (let i = 0; i < count; i++) {
    const one = createMockProduct();
    await productsServices.createOne(one);
  }
};

class MocksRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.read("/products/:n", ["PUBLIC"], async (req, res) => {
      const n = parseInt(req.params.n, 10);
      if (isNaN(n) || n < 0) {
        return res.json400({ error: `'n' debe ser un num entero mayor a 0` });
      }
      await generateMockProducts(n);
      res.json201({ products: n });
    });

    this.read("/users/:n", ["PUBLIC"], async (req, res) => {
      const n = parseInt(req.params.n, 10);
      if (isNaN(n) || n < 0) {
        return res.json400({ error: `'n' debe ser un num entero mayor a 0` });
      }
      await generateMockUsers(n);
      res.json201({ users: n });
    });

    this.read(
      "/generateData/:users/:products",
      ["PUBLIC"],
      async (req, res) => {
        const usersCount = parseInt(req.params.users, 10);
        const productsCount = parseInt(req.params.products, 10);
        if (
          isNaN(usersCount) ||
          isNaN(productsCount) ||
          usersCount < 0 ||
          productsCount < 0
        ) {
          return res.json400({
            error: "'users' y 'products' deben valer 0 o mayor",
          });
        }
        await generateMockProducts(productsCount);
        await generateMockUsers(usersCount);

        res.json201({ users: usersCount, products: productsCount });
      }
    );
  };
}

const mocksRouter = new MocksRouter();
export default mocksRouter.getRouter();
