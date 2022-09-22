import prisma from "../../src/config/database";
import voucherService from "../../src/services/voucherService";
import { createDataVoucher } from "../factories/voucherFactory";
import { Voucher } from "@prisma/client";
import voucherRepository from "../../src/repositories/voucherRepository";

describe("Teste unitarios", () => {
  it("Criar um voucher", async () => {
    const { code, discount } = createDataVoucher();

    const result = await voucherService.createVoucher(code, discount);
    const createdVoucher = await prisma.voucher.findUnique({ where: { code } });

    expect(createdVoucher).not.toBe(null);
  });
  it("Aplicar um voucher", async () => {
    const { code, discount } = createDataVoucher();
    const amount = 200;
    await voucherService.createVoucher(code, discount);

    const result = await voucherService.applyVoucher(code, amount);

    expect(result).toBeInstanceOf(Object);
  });
  it("Voucher já existe", async () => {
    const voucherData = {
      id: 1,
      discount: 10,
      code: "adf43",
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(voucherData);

    await expect(
      voucherService.createVoucher(voucherData.code, voucherData.discount)
    ).rejects.toStrictEqual({
      message: "Voucher already exist.",
      type: "conflict",
    });
  });
  it("Voucher não existe", async () => {
    const voucherData = {
      id: 1,
      discount: 10,
      code: "adf43",
      used: false,
    };
    const amount = 1000;

    await expect(
      voucherService.applyVoucher(voucherData.code, amount)
    ).rejects.toStrictEqual({
      message: "Voucher does not exist.",
      type: "conflict",
    });
  });
});
