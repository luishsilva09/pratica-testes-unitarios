import { faker } from "@faker-js/faker";

export function createDataVoucher() {
  const data = {
    code: faker.random.alphaNumeric(10),
    discount: faker.datatype.number({ min: 1, max: 100 }),
  };
  return data;
}
