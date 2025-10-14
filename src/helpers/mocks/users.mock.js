import { faker } from "@faker-js/faker";

const createMockUser = () => {
  const roles = ["USER", "ADMIN", "PREM"];
  const name = faker.internet.username();
  const date = faker.date.birthdate();
  const city = faker.location.city();
  const email = name + "@coder.com.ar";
  const password = "hola1234";
  const role = roles[faker.number.int({ min: 0, max: 2 })];
  const avatar = faker.image.url({
    category: "nature",
    width: 360,
    height: 360,
  });
  return { name, date, city, email, password, avatar, role };
};

export default createMockUser;
