import { faker } from "@faker-js/faker";

const createMockProduct = () => {
  const categories = [
    "Tablets",
    "Smartphones",
    "Laptops",
    "Smartwatches",
    "Headphones",
    "Speakers",
    "Desktops",
    "Streaming Devices",
    "Keyboards",
    "Accessories",
    "Virtual Reality",
    "Fitness",
    "Cameras",
    "Gaming",
    "Televisions",
    "Soundbars",
  ];
  const title = faker.commerce.productName();
  const description = faker.commerce.productDescription();
  const image = faker.image.urlLoremFlickr({
    category: "nature",
    width: 360,
    height: 360,
  });
  const category = categories[faker.number.int({ min: 0, max: 15 })];
  const price = Number.parseInt(
    faker.commerce.price({
      min: 10,
      max: 2000,
      dec: 0,
    })
  );
  const stock = faker.number.int({ min: 1, max: 100 });
  return { title, description, category, image, price, stock };
};

export default createMockProduct;
