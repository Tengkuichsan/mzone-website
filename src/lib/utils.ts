export const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};
