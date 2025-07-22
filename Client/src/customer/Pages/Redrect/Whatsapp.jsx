// WhatsApp numbers with fallbacks
const PRODUCT_WHATSAPP =
  import.meta.env.VITE_PRODUCT_WHATSAPP || "917325860606";
const LIVECLASS_WHATSAPP =
  import.meta.env.VITE_LIVECLASS_WHATSAPP || "917325860606";
const WORKSHOP_WHATSAPP =
  import.meta.env.VITE_WORKSHOP_WHATSAPP || "917325860606";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";

// Helper function to format phone number
const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Ensure it starts with country code
  return cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
};

// Debug environment variables
//console.log("PRODUCT_WHATSAPP:", PRODUCT_WHATSAPP);
//console.log("LIVECLASS_WHATSAPP:", LIVECLASS_WHATSAPP);
//console.log("WORKSHOP_WHATSAPP:", WORKSHOP_WHATSAPP);
//console.log("CLIENT_URL:", CLIENT_URL);

// For Products
export const handleProductBuy = (product, user) => {
  try {
    const formattedPhone = formatPhoneNumber(PRODUCT_WHATSAPP);
    const productUrl = `${CLIENT_URL}/products/${product.name}`; // or product.slug
    const message = `
    Hi, I want to buy the following product:
    - Name: ${product.name}
    - Price: ${product.new_price}
    - Description: ${product.description}
    - Image: ${product.images[0]}
    ${productUrl}
    My details:
    - Name: ${user.name}
    - Email: ${user.email}`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      message.trim()
    )}`;
    // console.log("Product WhatsApp URL:", url);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error opening WhatsApp for product:", error);
  }
};

export const handleLiveClassBook = (liveclass, user) => {
  try {
    const formattedPhone = formatPhoneNumber(LIVECLASS_WHATSAPP);
    const liveclassUrl = `${CLIENT_URL}/liveclasses/${liveclass.course}`; // or product.slug
    const message = `
    Hi, I want to buy the following liveclass:
    - Course: ${liveclass.course}
    ${liveclassUrl}
    My details:
    - Name: ${user.name}
    - Email: ${user.email}`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      message.trim()
    )}`;
    // console.log("LiveClass WhatsApp URL:", url);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error opening WhatsApp for liveclass:", error);
  }
};

export const handleWorkshop = (workshop, user) => {
  try {
    const formattedPhone = formatPhoneNumber(WORKSHOP_WHATSAPP);
    const workshopUrl = `${CLIENT_URL}/workshops/${workshop.title}`; // or product.slug
    const message = `
    Hi, I want to buy the following workshop:
    - Name: ${workshop.title}
    ${workshopUrl}
    My details:
    - Name: ${user.name}
    - Email: ${user.email}`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      message.trim()
    )}`;
    // console.log("Workshop WhatsApp URL:", url);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error opening WhatsApp for workshop:", error);
  }
};
