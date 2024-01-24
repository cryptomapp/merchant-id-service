import { getIrys } from "./irysService";

export const fundNodeService = async (amount: number): Promise<string> => {
  const irys = await getIrys();
  const fundTx = await irys.fund(irys.utils.toAtomic(amount));
  return fundTx.id;
};
