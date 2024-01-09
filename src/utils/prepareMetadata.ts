import { generateImage } from "../images/imageGenerator";
import { MerchantData, MerchantMetadata } from "../models/merchant";

export async function prepareMetadata(
  merchantData: MerchantData,
  imageUrl: string,
  id: number
): Promise<MerchantMetadata> {
  const attributes = Object.entries(merchantData).map(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      value = JSON.stringify(value);
    }
    return { trait_type: key, value: String(value) };
  });

  const nftImageUrl = await generateImage(id); // auto-gen logo with id

  const metadata: MerchantMetadata = {
    name: `MerchantID #${id}`,
    symbol: "MAP_ID",
    image: nftImageUrl,
    attributes: attributes,
    properties: {
      files: [
        {
          uri: imageUrl,
          type: "image/jpeg",
        },
      ],
      category: "image",
    },
  };

  return metadata;
}
