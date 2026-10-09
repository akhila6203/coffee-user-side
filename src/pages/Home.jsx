import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Phone,
  ShoppingCart,
  X,
} from "lucide-react";

/* =========================================================
   APIs
========================================================= */

import {
  getCategoriesApi,
  getProductsByCategoryApi,
  getRecentProductsApi,
} from "../api/productApi";

import { createCartApi } from "../api/cartApi";

import {
  createPaymentOrderApi,
  verifyPaymentApi,
} from "../api/orderApi";

import { loadRazorpay } from "../utils/loadRazorpay";

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import Header from "../components/Header";
import CheckoutModal from "../components/CheckoutModal";

/* =========================================================
   HELPERS
========================================================= */

const formatINR = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

/* =========================================================
   IMAGE ORIGIN
========================================================= */

const IMAGE_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (
    import.meta.env.VITE_API_BASE_URL || ""
  ).replace(/\/api\/?$/, "");

const imageUrl = (path) => {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${IMAGE_ORIGIN}${path}`;
};

/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

const normalizeProduct = (product) => {
  const images = Array.isArray(product?.images)
    ? product.images.map((image) => ({
        id: image.id,
        path: image.path,
        url: imageUrl(image.path),
      }))
    : [];

  const variants = Array.isArray(product?.sizes)
    ? product.sizes.map((size) => ({
        id: size.id,
        size: size.size,
        amount: Number(size.price || 0),
        mrp: 0,
      }))
    : [];

  return {
    ...product,

    category_name:
      product?.category_name || "",

    description:
      product?.description || "",

    images,

    image_url:
      images[0]?.url || "",

    variants,
  };
};

/* =========================================================
   NORMALIZE CATEGORY
========================================================= */

const normalizeCategory = (category) => ({
  id: category.id,
  name: category.name,
  image_url: imageUrl(
    category.image_path
  ),
});

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  /* =======================================================
     CATALOG
  ======================================================= */

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    recentProducts,
    setRecentProducts,
  ] = useState([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(null);

  const [
    categoryProducts,
    setCategoryProducts,
  ] = useState([]);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     CONTACT POPUP
  ======================================================= */

  const [
    showContactPopup,
    setShowContactPopup,
  ] = useState(false);

  /* =======================================================
     CART / CHECKOUT
  ======================================================= */

  const [
    cart,
    setCart,
  ] = useState({});

  const [
    cartId,
    setCartId,
  ] = useState(null);

  const [
    showCheckout,
    setShowCheckout,
  ] = useState(false);

  const [
    cartLoading,
    setCartLoading,
  ] = useState(false);

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(false);

  const [
    customer,
    setCustomer,
  ] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [
    successOrder,
    setSuccessOrder,
  ] = useState(null);

  /* =======================================================
     LOAD HOME

     Categories +
     Recently Added
  ======================================================= */

  const loadHome =
    useCallback(async () => {
      try {
        setLoading(true);

        setError("");

        const [
          categoryRes,
          recentRes,
        ] = await Promise.all([
          getCategoriesApi(),

          getRecentProductsApi(4),
        ]);

        const categoryData =
          categoryRes?.data?.data ??
          categoryRes?.data;

        const recentData =
          recentRes?.data?.data ??
          recentRes?.data;

        setCategories(
          Array.isArray(categoryData)
            ? categoryData.map(
                normalizeCategory
              )
            : []
        );

        setRecentProducts(
          Array.isArray(recentData)
            ? recentData.map(
                normalizeProduct
              )
            : []
        );
      } catch (err) {
        console.error(
          "Home load error:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "Unable to load the store."
          )
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  /* =======================================================
     OPEN CATEGORY
  ======================================================= */

  const openCategory =
    useCallback(
      async (category) => {
        setSelectedProduct(null);

        setActiveCategory(
          category
        );

        setCategoryProducts([]);

        setProductsLoading(true);

        setError("");

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        try {
          const response =
            await getProductsByCategoryApi(
              category.id
            );

          const data =
            response?.data?.data ??
            response?.data;

          setCategoryProducts(
            Array.isArray(data)
              ? data.map(
                  normalizeProduct
                )
              : []
          );
        } catch (err) {
          console.error(
            "Category products error:",
            err
          );

          setError(
            getErrorMessage(
              err,
              "Unable to load products."
            )
          );
        } finally {
          setProductsLoading(
            false
          );
        }
      },
      []
    );

  /* =======================================================
     OPEN PRODUCT
  ======================================================= */

  const openProduct =
    useCallback((product) => {
      setSelectedProduct(
        product
      );

      setError("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, []);

  /* =======================================================
     BACK HOME
  ======================================================= */

  const backToHome =
    useCallback(() => {
      setSelectedProduct(null);

      setActiveCategory(null);

      setCategoryProducts([]);

      setError("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, []);

  /* =======================================================
     BACK TO CATEGORY
  ======================================================= */

  const backToProducts =
    useCallback(() => {
      setSelectedProduct(null);

      setError("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, []);

  /* =======================================================
     SIMILAR PRODUCTS
  ======================================================= */

  const similarProducts =
    useMemo(() => {
      if (!selectedProduct) {
        return [];
      }

      if (
        activeCategory &&
        categoryProducts.length > 0
      ) {
        return categoryProducts.filter(
          (product) =>
            product.id !==
            selectedProduct.id
        );
      }

      return recentProducts.filter(
        (product) =>
          product.id !==
          selectedProduct.id
      );
    }, [
      selectedProduct,
      activeCategory,
      categoryProducts,
      recentProducts,
    ]);

  /* =======================================================
     ADD TO CART

     IMPORTANT:
     Existing products are NOT removed.

     Product 1
     +
     Product 2
     +
     Product 3

     all remain in cart.
  ======================================================= */

  const addToCart =
    useCallback(
      (product, variant) => {
        if (
          !product ||
          !variant
        ) {
          return;
        }

        /*
          Cart changed.

          Previous backend cart
          should be recreated
          before checkout.
        */

        setCartId(null);

        setCart((previous) => {
          const existing =
            previous[
              variant.id
            ];

          return {
            ...previous,

            [variant.id]: {
              product,
              variant,

              quantity:
                (
                  existing?.quantity ||
                  0
                ) + 1,
            },
          };
        });
      },
      []
    );

  /* =======================================================
     CHANGE QUANTITY
  ======================================================= */

  const changeQuantity =
    useCallback(
      (variantId, delta) => {
        setCartId(null);

        setCart((previous) => {
          const entry =
            previous[
              variantId
            ];

          if (!entry) {
            return previous;
          }

          const nextQuantity =
            entry.quantity +
            delta;

          if (
            nextQuantity <= 0
          ) {
            const updated = {
              ...previous,
            };

            delete updated[
              variantId
            ];

            return updated;
          }

          return {
            ...previous,

            [variantId]: {
              ...entry,

              quantity:
                nextQuantity,
            },
          };
        });
      },
      []
    );

  /* =======================================================
     CART ITEMS
  ======================================================= */

  const cartItems =
    useMemo(() => {
      return Object.values(
        cart
      ).map((entry) => {
        const price =
          Number(
            entry.variant
              .amount || 0
          );

        return {
          variantId:
            entry.variant.id,

          productId:
            entry.product.id,

          name:
            entry.product.name,

          image_url:
            entry.product
              .image_url,

          size:
            entry.variant.size,

          price,

          quantity:
            entry.quantity,

          total:
            price *
            entry.quantity,
        };
      });
    }, [cart]);

  /* =======================================================
     TOTAL QUANTITY
  ======================================================= */

  const totalQuantity =
    useMemo(() => {
      return cartItems.reduce(
        (sum, item) =>
          sum +
          item.quantity,
        0
      );
    }, [cartItems]);

  /* =======================================================
     TOTAL AMOUNT

     Automatically calculates
     all added products.
  ======================================================= */

  const totalAmount =
    useMemo(() => {
      return cartItems.reduce(
        (sum, item) =>
          sum + item.total,
        0
      );
    }, [cartItems]);

  /* =======================================================
     CHECKOUT

     Saves CURRENT complete cart
     to backend.
  ======================================================= */

  const handleCheckout =
    async () => {
      if (
        totalQuantity === 0
      ) {
        alert(
          "Please add at least one item to the cart."
        );

        return;
      }

      if (cartLoading) {
        return;
      }

      try {
        setCartLoading(true);

        const response =
          await createCartApi({
            items:
              cartItems.map(
                (item) => ({
                  productId:
                    Number(
                      item.productId
                    ),

                  variantId:
                    Number(
                      item.variantId
                    ),

                  quantity:
                    Number(
                      item.quantity
                    ),
                })
              ),
          });

        const savedCart =
          response?.data?.data;

        if (
          !savedCart?.cartId
        ) {
          throw new Error(
            "Cart was not saved."
          );
        }

        setCartId(
          savedCart.cartId
        );

        setShowCheckout(true);
      } catch (err) {
        console.error(
          "Create cart error:",
          err
        );

        alert(
          getErrorMessage(
            err,
            "Unable to save your cart."
          )
        );
      } finally {
        setCartLoading(false);
      }
    };

  /* =======================================================
     ADD MORE

     This is your new requirement.

     Checkout closes.
     Home page opens.

     IMPORTANT:
     cart is NOT cleared.
     customer details are NOT cleared.

     So user can add more products.
  ======================================================= */

  const handleAddMore =
    useCallback(() => {
      /*
        Close checkout only.
      */

      setShowCheckout(false);

      /*
        Go to home page.
      */

      setSelectedProduct(null);

      setActiveCategory(null);

      setCategoryProducts([]);

      setError("");

      /*
        IMPORTANT:

        DO NOT:

        setCart({})
        setCartId(null)
        setCustomer(...)

        Existing cart must stay.
      */

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, []);

  /* =======================================================
     PAY NOW
  ======================================================= */

  const handlePayNow =
    async (event) => {
      event.preventDefault();

      if (paymentLoading) {
        return;
      }

      /* CUSTOMER NAME */

      const customerName =
        customer.name.trim();

      if (!customerName) {
        alert(
          "Please enter your name."
        );

        return;
      }

      /* MOBILE */

      const mobile =
        customer.mobile.trim();

      if (
        !/^[6-9]\d{9}$/.test(
          mobile
        )
      ) {
        alert(
          "Please enter a valid 10-digit mobile number."
        );

        return;
      }

      /* ADDRESS */

      const address =
        customer.address.trim();

      if (
        address.length < 10
      ) {
        alert(
          "Please enter your full delivery address."
        );

        return;
      }

      /* CART */

      if (
        cartItems.length === 0
      ) {
        alert(
          "Your cart is empty."
        );

        return;
      }

      /*
        cartId is generated
        by handleCheckout.
      */

      if (!cartId) {
        alert(
          "Cart not found. Please checkout again."
        );

        setShowCheckout(
          false
        );

        return;
      }

      try {
        setPaymentLoading(
          true
        );

        /* LOAD RAZORPAY */

        const razorpayLoaded =
          await loadRazorpay();

        if (
          !razorpayLoaded
        ) {
          throw new Error(
            "Unable to load Razorpay."
          );
        }

        /* CREATE PAYMENT ORDER */

        const response =
          await createPaymentOrderApi(
            {
              customer_name:
                customerName,

              mobile,

              address,

              cart_id:
                cartId,
            }
          );

        const paymentData =
          response?.data?.data;

        if (
          !paymentData
            ?.razorpay_order_id ||
          !paymentData?.key_id ||
          !paymentData?.amount ||
          !paymentData?.order_id
        ) {
          console.error(
            "Invalid payment response:",
            paymentData
          );

          throw new Error(
            "Invalid payment response."
          );
        }

        /* ===============================================
           RAZORPAY OPTIONS
        =============================================== */

        const options = {
          key:
            paymentData.key_id,

          amount:
            paymentData.amount,

          currency:
            paymentData.currency ||
            "INR",

          name:
            "Coffee",

          description:
            "Order Payment",

          order_id:
            paymentData
              .razorpay_order_id,

          /* =============================================
             PAYMENT SUCCESS
          ============================================= */

          handler:
            async function (
              razorpayResponse
            ) {
              try {
                const verifyResponse =
                  await verifyPaymentApi(
                    {
                      order_id:
                        paymentData.order_id,

                      cart_id:
                        cartId,

                      razorpay_order_id:
                        razorpayResponse
                          .razorpay_order_id,

                      razorpay_payment_id:
                        razorpayResponse
                          .razorpay_payment_id,

                      razorpay_signature:
                        razorpayResponse
                          .razorpay_signature,
                    }
                  );

                if (
                  verifyResponse
                    ?.data?.success
                ) {
                  const verified =
                    verifyResponse
                      ?.data?.data ||
                    {};

                  setSuccessOrder(
                    {
                      orderId:
                        verified.order_id,

                      paymentId:
                        verified
                          .razorpay_payment_id,

                      paymentMethod:
                        verified
                          .payment_method ||
                        "Razorpay",

                      customerName:
                        verified
                          .customer_name ||
                        customerName,

                      mobile:
                        verified.mobile ||
                        mobile,

                      totalAmount:
                        Number(
                          verified
                            .total_amount ||
                            totalAmount
                        ),
                    }
                  );

                  /*
                    Payment success only:
                    clear complete cart.
                  */

                  setCart({});

                  setCustomer({
                    name: "",
                    mobile: "",
                    address: "",
                  });

                  setCartId(null);

                  setShowCheckout(
                    false
                  );
                } else {
                  alert(
                    "Payment verification failed."
                  );
                }
              } catch (
                verifyError
              ) {
                console.error(
                  "Payment verify error:",
                  verifyError
                );

                alert(
                  getErrorMessage(
                    verifyError,
                    "Payment verification failed."
                  )
                );
              } finally {
                setPaymentLoading(
                  false
                );
              }
            },

          /* PREFILL */

          prefill: {
            name:
              customerName,

            contact:
              mobile,
          },

          /* THEME */

          theme: {
            color:
              "#410102",
          },

          /* PAYMENT CLOSE */

          modal: {
            ondismiss:
              function () {
                setPaymentLoading(
                  false
                );
              },
          },
        };

        /* OPEN RAZORPAY */

        const razorpay =
          new window.Razorpay(
            options
          );

        /* PAYMENT FAILED */

        razorpay.on(
          "payment.failed",
          function (failure) {
            console.error(
              "Razorpay payment failed:",
              failure.error
            );

            alert(
              failure?.error
                ?.description ||
                "Payment failed. Please try again."
            );

            setPaymentLoading(
              false
            );
          }
        );

        razorpay.open();
      } catch (err) {
        console.error(
          "Payment error:",
          err
        );

        alert(
          getErrorMessage(
            err,
            "Unable to start payment."
          )
        );

        setPaymentLoading(
          false
        );
      }
    };

  /* =======================================================
     SUCCESS PAGE
  ======================================================= */

  if (successOrder) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#fffafa]
          px-4
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-[24px]
            border
            border-[#410102]/10
            bg-white
            p-7
            text-center
            shadow-xl
          "
        >
          {/* SUCCESS ICON */}

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-green-50
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="
                h-8
                w-8
                text-green-600
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12.5l4 4L19 7"
              />
            </svg>
          </div>

          <h1
            className="
              mt-5
              text-2xl
              font-black
              text-slate-900
            "
          >
            Payment Successful
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            Your order has been
            placed successfully.
            Thank you for shopping
            with Coffee.
          </p>

          {/* ORDER DETAILS */}

          <div
            className="
              mt-6
              rounded-2xl
              bg-[#fff8f8]
              p-5
              text-left
            "
          >
            {/* ORDER ID */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#410102]/10
                pb-3
              "
            >
              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                Order ID
              </span>

              <span
                className="
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                #
                {
                  successOrder.orderId
                }
              </span>
            </div>

            {/* PAYMENT METHOD */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#410102]/10
                py-3
              "
            >
              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                Payment Method
              </span>

              <span
                className="
                  text-sm
                  font-bold
                  capitalize
                  text-slate-900
                "
              >
                {
                  successOrder
                    .paymentMethod
                }
              </span>
            </div>

            {/* AMOUNT */}

            <div
              className="
                flex
                items-center
                justify-between
                pt-3
              "
            >
              <span
                className="
                  font-bold
                  text-slate-900
                "
              >
                Amount Paid
              </span>

              <span
                className="
                  text-xl
                  font-black
                  text-[#410102]
                "
              >
                ₹
                {formatINR(
                  successOrder
                    .totalAmount
                )}
              </span>
            </div>
          </div>

          {/* CONTINUE */}

          <button
            type="button"
            onClick={() => {
              setSuccessOrder(
                null
              );

              backToHome();
            }}
            className="
              mt-6
              w-full
              rounded-xl
              bg-[#410102]
              px-5
              py-3.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#410102]
            "
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#fffafa]
        pb-28
      "
    >
      {/* =================================================
          REUSABLE HEADER
      ================================================= */}

      <Header
        totalQuantity={
          totalQuantity
        }
        onHome={
          backToHome
        }
        onContact={() =>
          setShowContactPopup(
            true
          )
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        className="
          mx-auto
          max-w-6xl
          px-4
          pb-8
          pt-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            CATEGORIES
        ================================================= */}

        {!selectedProduct && (
          <section
            className="
              rounded-2xl
              bg-[#f6efef]
              px-2
              py-4
            "
          >
            <div
              className="
                flex
                gap-4
                overflow-x-auto
                px-2
                pb-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {/* LOADING */}

              {loading &&
                Array.from({
                  length: 7,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="
                        flex
                        w-[78px]
                        shrink-0
                        flex-col
                        items-center
                        gap-2
                      "
                    >
                      <div
                        className="
                          h-[78px]
                          w-[78px]
                          animate-pulse
                          rounded-2xl
                          bg-white
                        "
                      />

                      <div
                        className="
                          h-3
                          w-12
                          animate-pulse
                          rounded
                          bg-white
                        "
                      />
                    </div>
                  )
                )}

              {/* CATEGORY ITEMS */}

              {!loading &&
                categories.map(
                  (category) => {
                    const active =
                      activeCategory
                        ?.id ===
                      category.id;

                    return (
                      <button
                        key={
                          category.id
                        }
                        type="button"
                        onClick={() =>
                          openCategory(
                            category
                          )
                        }
                        className="
                          flex
                          w-[78px]
                          shrink-0
                          flex-col
                          items-center
                          gap-2
                          text-center
                        "
                      >
                        {/* IMAGE */}

                        <span
                          className={`
                            block
                            h-[78px]
                            w-[78px]
                            overflow-hidden
                            rounded-2xl
                            bg-white
                            ring-2
                            transition

                            ${
                              active
                                ? "ring-[#410102]"
                                : "ring-transparent"
                            }
                          `}
                        >
                          {category.image_url ? (
                            <img
                              src={
                                category.image_url
                              }
                              alt={
                                category.name
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            <span
                              className="
                                flex
                                h-full
                                w-full
                                bg-white
                              "
                            />
                          )}
                        </span>

                        {/* NAME */}

                        <span
                          className={`
                            text-[13px]
                            leading-tight

                            ${
                              active
                                ? "font-bold text-[#410102]"
                                : "font-medium text-slate-700"
                            }
                          `}
                        >
                          {
                            category.name
                          }
                        </span>
                      </button>
                    );
                  }
                )}
            </div>
          </section>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              py-10
              text-center
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-red-600
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={
                activeCategory
                  ? () =>
                      openCategory(
                        activeCategory
                      )
                  : loadHome
              }
              className="
                mt-3
                text-sm
                font-bold
                text-[#410102]
              "
            >
              Try again
            </button>
          </div>
        )}

        {/* =================================================
            RECENTLY ADDED
        ================================================= */}

        {!activeCategory &&
          !selectedProduct &&
          !error && (
            <section
              className="
                mt-6
              "
            >
              <div
                className="
                  mb-4
                "
              >
                <h2
                  className="
                    text-xl
                    font-black
                    text-slate-900
                    sm:text-2xl
                  "
                >
                  Recently added
                </h2>
              </div>

              {/* LOADING */}

              {loading ? (
                <ProductGridSkeleton />
              ) : recentProducts.length >
                0 ? (
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:gap-4
                    md:grid-cols-3
                    lg:grid-cols-4
                  "
                >
                  {recentProducts.map(
                    (product) => (
                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                        onView={
                          openProduct
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <div
                  className="
                    rounded-2xl
                    bg-white
                    py-12
                    text-center
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    No recently added
                    products available.
                  </p>
                </div>
              )}
            </section>
          )}

        {/* =================================================
            CATEGORY PRODUCTS
        ================================================= */}

        {activeCategory &&
          !selectedProduct &&
          !error && (
            <section
              className="
                mt-6
              "
            >
              {/* TITLE */}

              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={
                    backToHome
                  }
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#410102]/10
                    text-[#410102]
                    transition
                    hover:bg-[#410102]
                    hover:text-white
                  "
                  aria-label="Back to home"
                >
                  <ArrowLeft
                    size={18}
                  />
                </button>

                <h2
                  className="
                    text-xl
                    font-black
                    text-slate-900
                    sm:text-2xl
                  "
                >
                  {
                    activeCategory
                      .name
                  }
                </h2>
              </div>

              {/* LOADING */}

              {productsLoading && (
                <ProductGridSkeleton />
              )}

              {/* EMPTY */}

              {!productsLoading &&
                categoryProducts.length ===
                  0 && (
                  <div
                    className="
                      rounded-2xl
                      bg-white
                      py-14
                      text-center
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-500
                      "
                    >
                      No products in{" "}
                      {
                        activeCategory
                          .name
                      }{" "}
                      yet.
                    </p>
                  </div>
                )}

              {/* PRODUCTS */}

              {!productsLoading &&
                categoryProducts.length >
                  0 && (
                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3
                      sm:gap-4
                      md:grid-cols-3
                      lg:grid-cols-4
                    "
                  >
                    {categoryProducts.map(
                      (product) => (
                        <ProductCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                          onView={
                            openProduct
                          }
                        />
                      )
                    )}
                  </div>
                )}
            </section>
          )}

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        {selectedProduct &&
          !error && (
            <section
              className="
                mt-2
              "
            >
              <ProductDetails
                product={
                  selectedProduct
                }
                similarProducts={
                  similarProducts
                }
                onBack={
                  activeCategory
                    ? backToProducts
                    : backToHome
                }
                onAdd={
                  addToCart
                }
                onViewProduct={
                  openProduct
                }
              />
            </section>
          )}
      </main>

      {/* =================================================
          BOTTOM CART BAR
      ================================================= */}

      {totalQuantity > 0 &&
        !showCheckout && (
          <div
            className="
              fixed
              bottom-0
              left-0
              right-0
              z-40
              border-t
              border-[#410102]/10
              bg-white
              px-3
              py-3
              shadow-[0_-5px_20px_rgba(60,20,15,0.08)]
              sm:px-6
            "
          >
            <div
              className="
                mx-auto
                flex
                max-w-6xl
                items-center
                gap-3
              "
            >
              {/* TOTAL */}

              <div
                className="
                  min-w-[72px]
                "
              >
                <p
                  className="
                    text-[10px]
                    text-slate-500
                  "
                >
                  {totalQuantity}{" "}
                  {totalQuantity === 1
                    ? "item"
                    : "items"}
                </p>

                <p
                  className="
                    text-xl
                    font-black
                    leading-tight
                    text-slate-900
                  "
                >
                  ₹
                  {formatINR(
                    totalAmount
                  )}
                </p>
              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                disabled={
                  cartLoading
                }
                onClick={
                  handleCheckout
                }
                className="
                  flex
                  h-12
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#410102]
                  px-4
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  transition
                  hover:bg-[#410102]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <ShoppingCart
                  size={18}
                />

                {cartLoading
                  ? "Saving cart..."
                  : "View Cart & Checkout"}
              </button>
            </div>
          </div>
        )}

      {/* =================================================
          CONTACT POPUP
      ================================================= */}

      {showContactPopup && (
        <div
          className="
            fixed
            inset-0
            z-[70]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            backdrop-blur-[2px]
          "
          onClick={() =>
            setShowContactPopup(
              false
            )
          }
        >
          <div
            className="
              relative
              w-full
              max-w-[360px]
              overflow-hidden
              rounded-[20px]
              bg-white
              px-5
              pb-5
              pt-5
              text-center
              shadow-[0_20px_60px_rgba(0,0,0,0.22)]
              sm:max-w-[410px]
              sm:rounded-[24px]
              sm:px-6
              sm:pb-6
              sm:pt-6
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowContactPopup(
                  false
                )
              }
              className="
                absolute
                right-3
                top-3
                z-10
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-[#fff0f7]
                text-[#410102]
                transition
                hover:bg-[#410102]
                hover:text-white
                sm:right-4
                sm:top-4
                sm:h-9
                sm:w-9
              "
              aria-label="Close"
            >
              <X
                className="
                  h-4
                  w-4
                "
              />
            </button>

            {/* LOGO */}

            <div
              className="
                flex
                justify-center
                px-8
              "
            >
              <img
                src="/coffee.jpg"
                alt="The Coffee"
                className="
                  h-[75px]
                  w-auto
                  max-w-[190px]
                  object-contain
                  sm:h-[85px]
                  sm:max-w-[220px]
                "
              />
            </div>

            {/* ADDRESS */}

            <div
              className="
                mt-3
                rounded-xl
                border
                border-[#410102]/10
                bg-[#fff8fb]
                px-4
                py-3.5
                sm:mt-4
                sm:px-5
                sm:py-4
              "
            >
              <p
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.12em]
                  text-[#410102]
                  sm:text-[11px]
                "
              >
                Our Address
              </p>

              <p
                className="
                  mt-1.5
                  text-[12px]
                  font-medium
                  leading-5
                  text-slate-700
                  sm:text-[13px]
                  sm:leading-6
                "
              >
                The Coffee, hyderabad, Telangana, India.
              </p>
            </div>

            {/* BUTTONS */}

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-2.5
                sm:mt-5
                sm:gap-3
              "
            >
              {/* CALL */}

              <a
                href="tel:+919966465050"
                className="
                  flex
                  h-11
                  min-w-0
                  items-center
                  justify-center
                  gap-1.5
                  rounded-[10px]
                  bg-[#410102]
                  px-2
                  text-[11px]
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#410102]
                  sm:h-12
                  sm:text-xs
                "
              >
                <Phone
                  className="
                    h-4
                    w-4
                    shrink-0
                  "
                />

                Call Now
              </a>

              {/* WHATSAPP */}

              <a
                href="https://wa.me/919966465050?text=Hello%20The%20Coffee%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  h-11
                  min-w-0
                  items-center
                  justify-center
                  gap-1.5
                  rounded-[10px]
                  bg-[#25D366]
                  px-2
                  text-[11px]
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#1ebe5d]
                  sm:h-12
                  sm:text-xs
                "
              >
                <svg
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="
                    h-[17px]
                    w-[17px]
                    shrink-0
                  "
                  aria-hidden="true"
                >
                  <path d="M16.04 2.003c-7.72 0-13.998 6.278-13.998 14 0 2.47.644 4.88 1.868 7.002L1.93 30.22l7.38-1.936A13.93 13.93 0 0 0 16.04 30c7.72 0 14-6.278 14-13.997 0-7.722-6.28-14-14-14zm0 25.63a11.6 11.6 0 0 1-5.918-1.62l-.424-.25-4.38 1.148 1.17-4.27-.276-.438a11.59 11.59 0 0 1-1.79-6.2c0-6.407 5.21-11.62 11.618-11.62 6.408 0 11.62 5.213 11.62 11.62 0 6.407-5.212 11.63-11.62 11.63zm6.37-8.71c-.35-.175-2.07-1.02-2.39-1.137-.32-.117-.554-.175-.787.175-.233.35-.904 1.137-1.108 1.37-.204.234-.408.263-.758.088-.35-.175-1.477-.544-2.814-1.736-1.04-.928-1.743-2.074-1.947-2.424-.204-.35-.022-.54.153-.714.158-.157.35-.408.525-.612.175-.204.233-.35.35-.583.116-.233.058-.438-.03-.612-.087-.175-.787-1.896-1.078-2.6-.284-.683-.573-.59-.787-.6h-.67c-.234 0-.613.087-.934.437-.32.35-1.225 1.196-1.225 2.916s1.254 3.383 1.43 3.616c.174.233 2.467 3.766 5.978 5.282.835.36 1.486.575 1.994.736.838.266 1.6.228 2.202.138.672-.1 2.07-.846 2.36-1.662.292-.817.292-1.516.204-1.662-.087-.146-.32-.233-.67-.408z" />
                </svg>

                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          REUSABLE CHECKOUT

          New Add More functionality included.
      ================================================= */}

      <CheckoutModal
        open={
          showCheckout
        }
        cartItems={
          cartItems
        }
        totalAmount={
          totalAmount
        }
        customer={
          customer
        }
        setCustomer={
          setCustomer
        }
        paymentLoading={
          paymentLoading
        }
        onClose={() => {
          if (
            !paymentLoading
          ) {
            setShowCheckout(
              false
            );
          }
        }}
        onAddMore={
          handleAddMore
        }
        onChangeQuantity={
          changeQuantity
        }
        onPayNow={
          handlePayNow
        }
      />
    </div>
  );
}

/* =========================================================
   PRODUCT GRID SKELETON

   Reusable only inside Home.jsx.
========================================================= */

function ProductGridSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-4
        md:grid-cols-3
        lg:grid-cols-4
      "
    >
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-2xl
            bg-white
          "
        >
          {/* IMAGE */}

          <div
            className="
              h-[165px]
              animate-pulse
              bg-slate-100
              min-[400px]:h-[180px]
              sm:h-[220px]
              md:h-[250px]
              lg:h-[290px]
            "
          />

          {/* CONTENT */}

          <div
            className="
              p-3
              sm:p-4
            "
          >
            <div
              className="
                h-3
                w-16
                animate-pulse
                rounded
                bg-slate-100
              "
            />

            <div
              className="
                mt-2
                h-4
                w-3/4
                animate-pulse
                rounded
                bg-slate-100
              "
            />

            <div
              className="
                mt-4
                h-5
                w-1/2
                animate-pulse
                rounded
                bg-slate-100
              "
            />

            <div
              className="
                mt-3
                h-8
                animate-pulse
                rounded-lg
                bg-slate-100
                sm:h-9
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}






