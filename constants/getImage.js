import { images } from "@/constants/index";

export const getImage = (name) => {
  return images[name] || images.burgerOne; 
};
