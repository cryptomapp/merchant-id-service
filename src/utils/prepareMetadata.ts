import { MerchantData, MerchantMetadata } from "../models/merchant";

export function prepareMetadata(
  merchantData: MerchantData,
  imageUrl: string,
  id: number
): MerchantMetadata {
  const attributes = Object.entries(merchantData).map(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      value = JSON.stringify(value);
    }
    return { trait_type: key, value: String(value) };
  });

  const metadata: MerchantMetadata = {
    name: `MerchantID #${id}`,
    symbol: "MAP_ID",
    image: imageUrl, // TODO: auto-gen with logo
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
