// Server-side price table — the ONLY source of truth for amounts.
// The browser sends a curse id; it never sends a price.
// Amounts are in cents, USD.

const CURSES = [
  { id: 1, price: 449, text: "The line next to yours is always faster." },
  { id: 2, price: 499, text: "You can never find the second earbud." },
  { id: 3, price: 499, text: "Your Wi-Fi slows down when you need it most." },
  { id: 4, price: 449, text: "Your phone is always at 9%." },
  { id: 5, price: 399, text: "Every USB takes three tries." },
  { id: 6, price: 449, text: "Your charger only works at one angle." },
  { id: 7, price: 399, text: "One sock always disappears in the laundry." },
  { id: 8, price: 449, text: "Your fitted sheet always pops off one corner." },
  { id: 9, price: 399, text: "Your sleeves get wet when you wash your hands." },
  { id: 10, price: 449, text: "Your headphones always catch on door handles." },
  { id: 11, price: 399, text: "Your toast always lands topping-side down." },
  { id: 12, price: 449, text: "Your shopping cart always has one bad wheel." },
  { id: 13, price: 499, text: "Your password is always \u201cincorrect\u201d on the first try." },
  { id: 14, price: 499, text: "Your delivery arrives five minutes after you leave." },
  { id: 15, price: 449, text: "Your socks are always slightly damp." },
  { id: 16, price: 499, text: "Your pillow is always warm on both sides." },
  { id: 17, price: 449, text: "You always pick the slowest checkout." },
  { id: 18, price: 399, text: "Your shoelaces randomly come undone." },
  { id: 19, price: 449, text: "Your phone falls between the bed and the wall." },
  { id: 20, price: 499, text: "You always forget why you entered the room." },
  { id: 21, price: 449, text: "Your autocorrect changes the right word." },
  { id: 22, price: 399, text: "Your screen brightness is always slightly wrong." },
  { id: 23, price: 399, text: "Your cereal gets soggy immediately." },
  { id: 24, price: 449, text: "Your ice cream always melts too fast." },
  { id: 25, price: 499, text: "Your favorite song always gets interrupted." },
  { id: 26, price: 449, text: "You always step on one mysterious wet spot." },
  { id: 27, price: 499, text: "Your blanket never covers both feet and shoulders." },
  { id: 28, price: 399, text: "Your pen stops working when someone asks to borrow it." },
  { id: 29, price: 399, text: "Your popcorn always has too many unpopped kernels." },
  { id: 30, price: 499, text: "Your alarm goes off right before the best part of your dream." }
];

// A written-to-order curse is a fixed-price item.
const CUSTOM = { id: "custom", price: 499, text: "Custom curse" };

function lookup(curseId) {
  if (curseId === "custom") return CUSTOM;
  const n = Number(curseId);
  if (!Number.isInteger(n)) return null;
  return CURSES.find((c) => c.id === n) || null;
}

module.exports = { CURSES, CUSTOM, lookup };
