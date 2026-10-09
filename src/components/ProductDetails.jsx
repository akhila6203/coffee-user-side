import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import ProductCard from "./ProductCard";

/* =========================================================
   PRICE FORMAT
========================================================= */

const formatINR = (value) =>
  Number(value || 0).toLocaleString("en-IN");

/* =========================================================
   PRODUCT DETAILS
========================================================= */

export default function ProductDetails({
  product,
  similarProducts = [],
  onBack,
  onAdd,
  onViewProduct,
}) {
  /* =======================================================
     PRODUCT DATA
  ======================================================= */

  const images = Array.isArray(product?.images)
    ? product.images
    : [];

  const variants = Array.isArray(product?.variants)
    ? product.variants
    : [];

  /* =======================================================
     ACTIVE IMAGE
  ======================================================= */

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  /* =======================================================
     DEFAULT SIZE

     First backend size selected by default.
  ======================================================= */

  const [
    selectedVariantId,
    setSelectedVariantId,
  ] = useState(
    variants[0]?.id || null
  );

  /* =======================================================
     PRODUCT DESCRIPTION

     Open by default.
     User can hide/show using arrow.
  ======================================================= */

  const [
    descriptionOpen,
    setDescriptionOpen,
  ] = useState(true);

  /* =======================================================
     WHEN PRODUCT CHANGES
  ======================================================= */

  useEffect(() => {
    setActiveImage(0);

    setSelectedVariantId(
      product?.variants?.[0]?.id ||
        null
    );

    setDescriptionOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [product?.id]);

  /* =======================================================
     SELECTED VARIANT
  ======================================================= */

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.id ===
        selectedVariantId
    ) ||
    variants[0] ||
    null;

  /* =======================================================
     CURRENT PRICE

     Changes automatically when size changes.
  ======================================================= */

  const currentPrice = Number(
    selectedVariant?.amount || 0
  );

  /* =======================================================
     PREVIOUS IMAGE
  ======================================================= */

  const previousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage(
      (previous) =>
        previous === 0
          ? images.length - 1
          : previous - 1
    );
  };

  /* =======================================================
     NEXT IMAGE
  ======================================================= */

  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage(
      (previous) =>
        previous ===
        images.length - 1
          ? 0
          : previous + 1
    );
  };

  /* =======================================================
     ADD TO CART

     Calls existing Home.jsx addToCart.
     No backend/cart flow change.
  ======================================================= */

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert(
        "Please select a size."
      );

      return;
    }

    onAdd(
      product,
      selectedVariant
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        w-full
      "
    >
      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <div
        className="
          mb-3

          sm:mb-4

          lg:mb-5
        "
      >
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex
            items-center
            gap-1.5

            text-xs
            font-bold
            text-slate-700

            transition-colors

            hover:text-[#410102]

            sm:gap-2
            sm:text-sm
          "
        >
          <ArrowLeft
            className="
              h-4
              w-4

              sm:h-[18px]
              sm:w-[18px]
            "
          />

          Back to Products
        </button>
      </div>

      {/* =================================================
          MAIN PRODUCT DETAILS CARD
      ================================================= */}

      <section
        className="
          overflow-hidden

          rounded-[14px]

          border
          border-slate-200

          bg-white

          sm:rounded-[18px]

          lg:rounded-[22px]
        "
      >
        <div
          className="
            grid
            grid-cols-1

            lg:grid-cols-2
          "
        >
          {/* =================================================
              LEFT SIDE - IMAGE GALLERY
          ================================================= */}

          <div
            className="
              border-b
              border-slate-200

              p-2.5

              sm:p-4

              md:p-5

              lg:border-b-0
              lg:border-r
              lg:p-6
            "
          >
            {/* ===============================================
                MAIN IMAGE

                Mobile:
                compact height

                Tablet:
                medium

                Desktop:
                large

                object-cover prevents the tiny-image problem
                visible in your first screenshot.
            =============================================== */}

            <div
              className="
                relative

                h-[300px]
                w-full

                overflow-hidden

                rounded-[10px]

                bg-[#f7f7f7]

                sm:h-[380px]
                sm:rounded-xl

                md:h-[430px]

                lg:h-[520px]
              "
            >
              {images[
                activeImage
              ]?.url ? (
                <img
                  src={
                    images[
                      activeImage
                    ].url
                  }
                  alt={
                    product?.name ||
                    "Product"
                  }
                  className="
                    h-full
                    w-full

                    object-cover
                    object-center
                  "
                />
              ) : product?.image_url ? (
                <img
                  src={
                    product.image_url
                  }
                  alt={
                    product?.name ||
                    "Product"
                  }
                  className="
                    h-full
                    w-full

                    object-cover
                    object-center
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center

                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  No Image
                </div>
              )}

              {/* =============================================
                  IMAGE SLIDER ARROWS
              ============================================= */}

              {images.length > 1 && (
                <>
                  {/* LEFT */}

                  <button
                    type="button"
                    onClick={
                      previousImage
                    }
                    className="
                      absolute
                      left-2
                      top-1/2

                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center

                      rounded-full
                      bg-white/95

                      text-slate-700

                      shadow-md

                      transition

                      hover:bg-[#410102]
                      hover:text-white

                      sm:left-3
                      sm:h-9
                      sm:w-9

                      lg:h-10
                      lg:w-10
                    "
                    aria-label="Previous image"
                  >
                    <ChevronLeft
                      className="
                        h-4
                        w-4

                        sm:h-5
                        sm:w-5
                      "
                    />
                  </button>

                  {/* RIGHT */}

                  <button
                    type="button"
                    onClick={
                      nextImage
                    }
                    className="
                      absolute
                      right-2
                      top-1/2

                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center

                      rounded-full
                      bg-white/95

                      text-slate-700

                      shadow-md

                      transition

                      hover:bg-[#410102]
                      hover:text-white

                      sm:right-3
                      sm:h-9
                      sm:w-9

                      lg:h-10
                      lg:w-10
                    "
                    aria-label="Next image"
                  >
                    <ChevronRight
                      className="
                        h-4
                        w-4

                        sm:h-5
                        sm:w-5
                      "
                    />
                  </button>
                </>
              )}

              {/* =============================================
                  IMAGE COUNTER
              ============================================= */}

              {images.length > 1 && (
                <div
                  className="
                    absolute
                    bottom-2
                    right-2

                    rounded-full

                    bg-white/95

                    px-2.5
                    py-1

                    text-[10px]
                    font-bold
                    text-slate-700

                    shadow-sm

                    sm:bottom-3
                    sm:right-3
                    sm:px-3
                    sm:py-1.5
                    sm:text-xs
                  "
                >
                  {activeImage + 1}
                  {" / "}
                  {images.length}
                </div>
              )}
            </div>

            {/* ===============================================
                THUMBNAILS
            =============================================== */}

            {images.length > 1 && (
              <div
                className="
                  mt-2.5

                  flex
                  gap-2

                  overflow-x-auto

                  pb-1

                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden

                  sm:mt-3
                  sm:gap-2.5

                  lg:mt-4
                  lg:gap-3
                "
              >
                {images.map(
                  (image, index) => {
                    const active =
                      activeImage ===
                      index;

                    return (
                      <button
                        key={
                          image.id ||
                          index
                        }
                        type="button"
                        onClick={() =>
                          setActiveImage(
                            index
                          )
                        }
                        className={`
                          h-[58px]
                          w-[50px]

                          shrink-0

                          overflow-hidden

                          rounded-md

                          border-2

                          bg-[#f7f7f7]

                          transition-all

                          sm:h-[68px]
                          sm:w-[58px]

                          md:h-[76px]
                          md:w-[64px]

                          lg:h-[86px]
                          lg:w-[72px]
                          lg:rounded-lg

                          ${
                            active
                              ? "border-[#410102]"
                              : "border-slate-200"
                          }
                        `}
                        aria-label={`View product image ${
                          index + 1
                        }`}
                      >
                        <img
                          src={
                            image.url
                          }
                          alt={`${product?.name || "Product"} ${index + 1}`}
                          className="
                            h-full
                            w-full

                            object-cover
                            object-center
                          "
                        />
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT SIDE - PRODUCT INFORMATION
          ================================================= */}

          <div
            className="
              p-4

              sm:p-5

              md:p-6

              lg:p-8
              xl:p-9
            "
          >
            {/* ===============================================
                CATEGORY
            =============================================== */}

            <p
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-[#410102]

                sm:text-[11px]

                lg:text-xs
                lg:tracking-[0.14em]
              "
            >
              {product?.category_name ||
                "Product"}
            </p>

            {/* ===============================================
                PRODUCT NAME
            =============================================== */}

            <h1
              className="
                mt-1

                text-xl
                font-black
                leading-tight
                text-slate-900

                sm:mt-1.5
                sm:text-2xl

                md:text-3xl

                lg:mt-2
                lg:text-4xl
              "
            >
              {product?.name}
            </h1>

            {/* ===============================================
                PRICE
            =============================================== */}

            <div
              className="
                mt-3

                border-b
                border-slate-200

                pb-3

                sm:mt-4
                sm:pb-4

                lg:mt-5
                lg:pb-5
              "
            >
              <span
                className="
                  text-xl
                  font-black
                  text-slate-900

                  sm:text-2xl

                  lg:text-3xl
                "
              >
                ₹
                {formatINR(
                  currentPrice
                )}
              </span>
            </div>

            {/* ===============================================
                SIZE SELECTION
            =============================================== */}

            {variants.length > 0 && (
              <div
                className="
                  mt-4

                  sm:mt-5

                  lg:mt-6
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <h3
                    className="
                      text-xs
                      font-bold
                      text-slate-900

                      sm:text-sm
                    "
                  >
                    Select Size
                  </h3>

                  {selectedVariant && (
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-slate-500

                        sm:text-xs
                      "
                    >
                      {
                        selectedVariant.size
                      }
                    </span>
                  )}
                </div>

                {/* SIZE BUTTONS */}

                <div
                  className="
                    mt-2.5

                    flex
                    flex-wrap
                    gap-2

                    sm:mt-3
                    sm:gap-2.5

                    lg:gap-3
                  "
                >
                  {variants.map(
                    (variant) => {
                      const active =
                        variant.id ===
                        selectedVariantId;

                      return (
                        <button
                          key={
                            variant.id
                          }
                          type="button"
                          onClick={() =>
                            setSelectedVariantId(
                              variant.id
                            )
                          }
                          className={`
                            min-w-[46px]

                            rounded-[7px]

                            border

                            px-3
                            py-2

                            text-[11px]
                            font-bold

                            transition

                            sm:min-w-[52px]
                            sm:px-3.5
                            sm:py-2.5
                            sm:text-xs

                            lg:min-w-[58px]
                            lg:rounded-lg
                            lg:px-4
                            lg:text-sm

                            ${
                              active
                                ? "border-[#410102] bg-[#410102] text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-[#410102]"
                            }
                          `}
                        >
                          {
                            variant.size
                          }
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* ===============================================
                SELECTED SIZE / PRICE BOX
            =============================================== */}

            {selectedVariant && (
              <div
                className="
                  mt-4

                  flex
                  items-center
                  justify-between

                  rounded-[10px]

                  bg-[#fff7fb]

                  p-3

                  sm:mt-5
                  sm:p-3.5

                  lg:mt-6
                  lg:rounded-xl
                  lg:p-4
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      text-slate-500

                      sm:text-xs
                    "
                  >
                    Price for{" "}
                    {
                      selectedVariant.size
                    }
                  </p>

                  <p
                    className="
                      mt-0.5

                      text-lg
                      font-black
                      text-slate-900

                      sm:mt-1
                      sm:text-xl
                    "
                  >
                    ₹
                    {formatINR(
                      selectedVariant.amount
                    )}
                  </p>
                </div>

                <ShoppingBag
                  className="
                    h-5
                    w-5
                    text-[#410102]

                    sm:h-[22px]
                    sm:w-[22px]
                  "
                />
              </div>
            )}

            {/* ===============================================
                ADD TO CART
            =============================================== */}

            <button
              type="button"
              disabled={
                !selectedVariant
              }
              onClick={
                handleAddToCart
              }
              className="
                mt-4

                flex
                h-10
                w-full
                items-center
                justify-center
                gap-2

                rounded-[8px]

                bg-[#410102]

                px-4

                text-[11px]
                font-extrabold
                uppercase
                tracking-wide
                text-white

                transition-colors

                hover:bg-[#c90069]

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:mt-5
                sm:h-12
                sm:rounded-[10px]
                sm:text-xs

                lg:mt-6
                lg:h-14
                lg:rounded-xl
                lg:text-sm
              "
            >
              <ShoppingCart
                className="
                  h-4
                  w-4

                  sm:h-[18px]
                  sm:w-[18px]

                  lg:h-[19px]
                  lg:w-[19px]
                "
              />

              Add to Cart
            </button>

            {/* ===============================================
                PRODUCT DESCRIPTION

                Only details page contains description.

                Arrow can hide/show it.
            =============================================== */}

            <div
              className="
                mt-4

                overflow-hidden

                rounded-[10px]

                border
                border-slate-200

                sm:mt-5

                lg:mt-7
                lg:rounded-xl
              "
            >
              {/* DESCRIPTION HEADER */}

              <button
                type="button"
                onClick={() =>
                  setDescriptionOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-3

                  px-3
                  py-3

                  text-left

                  sm:px-4
                  sm:py-3.5

                  lg:px-5
                  lg:py-4
                "
              >
                <span
                  className="
                    text-[12px]
                    font-bold
                    text-slate-900

                    sm:text-sm

                    lg:text-base
                  "
                >
                  Product Description
                </span>

                {descriptionOpen ? (
                  <ChevronUp
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-slate-500

                      lg:h-[18px]
                      lg:w-[18px]
                    "
                  />
                ) : (
                  <ChevronDown
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-slate-500

                      lg:h-[18px]
                      lg:w-[18px]
                    "
                  />
                )}
              </button>

              {/* DESCRIPTION CONTENT */}

              {descriptionOpen && (
                <div
                  className="
                    border-t
                    border-slate-200

                    px-3
                    py-3

                    sm:px-4
                    sm:py-3.5

                    lg:px-5
                    lg:py-4
                  "
                >
                  {product?.description ? (
                    <p
                      className="
                        whitespace-pre-line

                        text-[11px]
                        leading-[18px]
                        text-slate-600

                        sm:text-xs
                        sm:leading-5

                        md:text-[13px]
                        md:leading-6

                        lg:text-sm
                        lg:leading-7
                      "
                    >
                      {
                        product.description
                      }
                    </p>
                  ) : (
                    <p
                      className="
                        text-[11px]
                        text-slate-400

                        sm:text-xs

                        lg:text-sm
                      "
                    >
                      Product description
                      is not available.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SIMILAR PRODUCTS

          Reuses the same ProductCard.

          Therefore:
          - no description on card
          - same mobile card
          - same image sizing
          - same View More
      ================================================= */}

      {similarProducts.length > 0 && (
        <section
          className="
            mt-6

            sm:mt-8

            lg:mt-10
          "
        >
          {/* HEADING */}

          <div
            className="
              mb-3

              sm:mb-4

              lg:mb-5
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
              Similar Products
            </h2>
          </div>

          {/* PRODUCT GRID */}

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
            {similarProducts
              .slice(0, 4)
              .map(
                (
                  similarProduct
                ) => (
                  <ProductCard
                    key={
                      similarProduct.id
                    }
                    product={
                      similarProduct
                    }
                    onView={
                      onViewProduct
                    }
                  />
                )
              )}
          </div>
        </section>
      )}
    </div>
  );
}


// import {
//   ArrowLeft,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ChevronUp,
//   ShoppingBag,
//   ShoppingCart,
// } from "lucide-react";

// import {
//   useEffect,
//   useState,
// } from "react";

// import ProductCard from "./ProductCard";

// const formatINR = (value) =>
//   Number(value || 0).toLocaleString("en-IN");

// export default function ProductDetails({
//   product,
//   similarProducts = [],
//   onBack,
//   onAdd,
//   onViewProduct,
// }) {
//   const images = Array.isArray(product?.images)
//     ? product.images
//     : [];

//   const variants = Array.isArray(product?.variants)
//     ? product.variants
//     : [];

//   /* ================================
//      DEFAULT FIRST IMAGE
//   ================================ */

//   const [activeImage, setActiveImage] =
//     useState(0);

//   /* ================================
//      DEFAULT FIRST SIZE

//      Requirement:
//      page opens -> first size selected
//      -> first size price visible
//   ================================ */

//   const [
//     selectedVariantId,
//     setSelectedVariantId,
//   ] = useState(
//     variants[0]?.id || null
//   );

//   /* ================================
//      DESCRIPTION OPEN/CLOSE
//   ================================ */

//   const [
//     descriptionOpen,
//     setDescriptionOpen,
//   ] = useState(true);

//   /* ================================
//      PRODUCT CHANGE
//   ================================ */

//   useEffect(() => {
//     setActiveImage(0);

//     setSelectedVariantId(
//       product?.variants?.[0]?.id ||
//         null
//     );

//     setDescriptionOpen(true);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   }, [product?.id]);

//   /* ================================
//      SELECTED SIZE
//   ================================ */

//   const selectedVariant =
//     variants.find(
//       (variant) =>
//         variant.id ===
//         selectedVariantId
//     ) ||
//     variants[0] ||
//     null;

//   const currentPrice = Number(
//     selectedVariant?.amount || 0
//   );

//   /* ================================
//      IMAGE SLIDER
//   ================================ */

//   const previousImage = () => {
//     if (images.length <= 1) return;

//     setActiveImage((previous) =>
//       previous === 0
//         ? images.length - 1
//         : previous - 1
//     );
//   };

//   const nextImage = () => {
//     if (images.length <= 1) return;

//     setActiveImage((previous) =>
//       previous ===
//       images.length - 1
//         ? 0
//         : previous + 1
//     );
//   };

//   /* ================================
//      ADD TO CART

//      Calls existing Home addToCart.
//      No backend flow change.
//   ================================ */

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       alert(
//         "Please select a size."
//       );
//       return;
//     }

//     onAdd(
//       product,
//       selectedVariant
//     );
//   };

//   return (
//     <div>
//       {/* =============================
//           BACK
//       ============================= */}

//       <div className="mb-5">
//         <button
//           type="button"
//           onClick={onBack}
//           className="
//             inline-flex
//             items-center
//             gap-2
//             text-sm
//             font-bold
//             text-slate-700
//             transition
//             hover:text-[#410102]
//           "
//         >
//           <ArrowLeft size={18} />

//           Back to Products
//         </button>
//       </div>

//       {/* =============================
//           PRODUCT DETAILS
//       ============================= */}

//       <section
//         className="
//           overflow-hidden
//           rounded-[22px]
//           border
//           border-slate-200
//           bg-white
//         "
//       >
//         <div
//           className="
//             grid
//             lg:grid-cols-2
//           "
//         >
//           {/* =========================
//               LEFT SIDE
//           ========================= */}

//           <div
//             className="
//               border-b
//               border-slate-200
//               p-4
//               sm:p-6
//               lg:border-b-0
//               lg:border-r
//             "
//           >
//             {/* BIG IMAGE */}

//             <div
//               className="
//                 relative
//                 flex
//                 min-h-[420px]
//                 items-center
//                 justify-center
//                 overflow-hidden
//                 rounded-xl
//                 bg-[#fafafa]
//                 sm:min-h-[520px]
//               "
//             >
//               {images[
//                 activeImage
//               ]?.url ? (
//                 <img
//                   src={
//                     images[
//                       activeImage
//                     ].url
//                   }
//                   alt={product.name}
//                   className="
//                     h-full
//                     max-h-[600px]
//                     w-full
//                     object-contain
//                   "
//                 />
//               ) : (
//                 <div className="text-sm text-slate-400">
//                   No Image
//                 </div>
//               )}

//               {/* LEFT / RIGHT */}

//               {images.length > 1 && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={
//                       previousImage
//                     }
//                     className="
//                       absolute
//                       left-3
//                       top-1/2
//                       flex
//                       h-10
//                       w-10
//                       -translate-y-1/2
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-white
//                       text-slate-700
//                       shadow-md
//                       transition
//                       hover:bg-[#410102]
//                       hover:text-white
//                     "
//                   >
//                     <ChevronLeft
//                       size={20}
//                     />
//                   </button>

//                   <button
//                     type="button"
//                     onClick={
//                       nextImage
//                     }
//                     className="
//                       absolute
//                       right-3
//                       top-1/2
//                       flex
//                       h-10
//                       w-10
//                       -translate-y-1/2
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-white
//                       text-slate-700
//                       shadow-md
//                       transition
//                       hover:bg-[#410102]
//                       hover:text-white
//                     "
//                   >
//                     <ChevronRight
//                       size={20}
//                     />
//                   </button>
//                 </>
//               )}

//               {/* COUNTER */}

//               {images.length > 1 && (
//                 <div
//                   className="
//                     absolute
//                     bottom-3
//                     right-3
//                     rounded-full
//                     bg-white
//                     px-3
//                     py-1.5
//                     text-xs
//                     font-bold
//                     text-slate-700
//                     shadow
//                   "
//                 >
//                   {activeImage + 1} /{" "}
//                   {images.length}
//                 </div>
//               )}
//             </div>

//             {/* =========================
//                 SMALL IMAGES
//             ========================= */}

//             {images.length > 1 && (
//               <div
//                 className="
//                   mt-4
//                   flex
//                   gap-3
//                   overflow-x-auto
//                   pb-2
//                 "
//               >
//                 {images.map(
//                   (image, index) => {
//                     const active =
//                       activeImage ===
//                       index;

//                     return (
//                       <button
//                         key={
//                           image.id ||
//                           index
//                         }
//                         type="button"
//                         onClick={() =>
//                           setActiveImage(
//                             index
//                           )
//                         }
//                         className={`
//                           h-[86px]
//                           w-[72px]
//                           shrink-0
//                           overflow-hidden
//                           rounded-lg
//                           border-2
//                           bg-white
//                           transition
//                           ${
//                             active
//                               ? "border-[#410102]"
//                               : "border-slate-200"
//                           }
//                         `}
//                       >
//                         <img
//                           src={
//                             image.url
//                           }
//                           alt=""
//                           className="
//                             h-full
//                             w-full
//                             object-cover
//                           "
//                         />
//                       </button>
//                     );
//                   }
//                 )}
//               </div>
//             )}
//           </div>

//           {/* =========================
//               RIGHT SIDE
//           ========================= */}

//           <div
//             className="
//               p-5
//               sm:p-7
//               lg:p-9
//             "
//           >
//             {/* CATEGORY */}

//             <p
//               className="
//                 text-xs
//                 font-extrabold
//                 uppercase
//                 tracking-[0.14em]
//                 text-[#410102]
//               "
//             >
//               {product.category_name}
//             </p>

//             {/* NAME */}

//             <h1
//               className="
//                 mt-2
//                 text-3xl
//                 font-black
//                 leading-tight
//                 text-slate-900
//                 sm:text-4xl
//               "
//             >
//               {product.name}
//             </h1>

//             {/* PRICE */}

//             <div
//               className="
//                 mt-5
//                 border-b
//                 border-slate-200
//                 pb-5
//               "
//             >
//               <span
//                 className="
//                   text-3xl
//                   font-black
//                   text-slate-900
//                 "
//               >
//                 ₹
//                 {formatINR(
//                   currentPrice
//                 )}
//               </span>
//             </div>

//             {/* =========================
//                 SIZES
//             ========================= */}

//             <div className="mt-6">
//               <div
//                 className="
//                   flex
//                   items-center
//                   justify-between
//                 "
//               >
//                 <h3
//                   className="
//                     text-sm
//                     font-bold
//                     text-slate-900
//                   "
//                 >
//                   Select Size
//                 </h3>

//                 {selectedVariant && (
//                   <span
//                     className="
//                       text-xs
//                       font-semibold
//                       text-slate-500
//                     "
//                   >
//                     {
//                       selectedVariant.size
//                     }
//                   </span>
//                 )}
//               </div>

//               <div
//                 className="
//                   mt-3
//                   flex
//                   flex-wrap
//                   gap-3
//                 "
//               >
//                 {variants.map(
//                   (variant) => {
//                     const active =
//                       variant.id ===
//                       selectedVariantId;

//                     return (
//                       <button
//                         key={
//                           variant.id
//                         }
//                         type="button"
//                         onClick={() =>
//                           setSelectedVariantId(
//                             variant.id
//                           )
//                         }
//                         className={`
//                           min-w-[58px]
//                           border
//                           px-4
//                           py-2.5
//                           text-sm
//                           font-bold
//                           transition
//                           ${
//                             active
//                               ? "border-[#410102] bg-[#410102] text-white"
//                               : "border-slate-300 bg-white text-slate-700 hover:border-[#410102]"
//                           }
//                         `}
//                       >
//                         {
//                           variant.size
//                         }
//                       </button>
//                     );
//                   }
//                 )}
//               </div>
//             </div>

//             {/* =========================
//                 SELECTED PRICE BOX
//             ========================= */}

//             {selectedVariant && (
//               <div
//                 className="
//                   mt-6
//                   flex
//                   items-center
//                   justify-between
//                   rounded-xl
//                   bg-[#fff7fb]
//                   p-4
//                 "
//               >
//                 <div>
//                   <p
//                     className="
//                       text-xs
//                       text-slate-500
//                     "
//                   >
//                     Price for{" "}
//                     {
//                       selectedVariant.size
//                     }
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-xl
//                       font-black
//                       text-slate-900
//                     "
//                   >
//                     ₹
//                     {formatINR(
//                       selectedVariant.amount
//                     )}
//                   </p>
//                 </div>

//                 <ShoppingBag
//                   size={22}
//                   className="text-[#410102]"
//                 />
//               </div>
//             )}

//             {/* =========================
//                 ADD TO CART
//             ========================= */}

//             <button
//               type="button"
//               disabled={
//                 !selectedVariant
//               }
//               onClick={
//                 handleAddToCart
//               }
//               className="
//                 mt-6
//                 flex
//                 h-14
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 bg-[#410102]
//                 text-sm
//                 font-extrabold
//                 uppercase
//                 tracking-wide
//                 text-white
//                 transition
//                 hover:bg-[#c90069]
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//             >
//               <ShoppingCart
//                 size={19}
//               />

//               Add to Cart
//             </button>

//             {/* =========================
//                 COLLAPSIBLE DESCRIPTION
//             ========================= */}

//             <div
//               className="
//                 mt-7
//                 border
//                 border-slate-200
//               "
//             >
//               <button
//                 type="button"
//                 onClick={() =>
//                   setDescriptionOpen(
//                     (previous) =>
//                       !previous
//                   )
//                 }
//                 className="
//                   flex
//                   w-full
//                   items-center
//                   justify-between
//                   gap-4
//                   px-5
//                   py-4
//                   text-left
//                 "
//               >
//                 <span
//                   className="
//                     text-base
//                     font-bold
//                     text-slate-900
//                   "
//                 >
//                   Product Description
//                 </span>

//                 {descriptionOpen ? (
//                   <ChevronUp
//                     size={18}
//                     className="text-slate-500"
//                   />
//                 ) : (
//                   <ChevronDown
//                     size={18}
//                     className="text-slate-500"
//                   />
//                 )}
//               </button>

//               {descriptionOpen && (
//                 <div
//                   className="
//                     border-t
//                     border-slate-200
//                     px-5
//                     py-4
//                   "
//                 >
//                   {product.description ? (
//                     <p
//                       className="
//                         whitespace-pre-line
//                         text-sm
//                         leading-7
//                         text-slate-600
//                       "
//                     >
//                       {
//                         product.description
//                       }
//                     </p>
//                   ) : (
//                     <p
//                       className="
//                         text-sm
//                         text-slate-400
//                       "
//                     >
//                       Product description
//                       is not available.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =============================
//           SIMILAR PRODUCTS
//       ============================= */}

//       {similarProducts.length >
//         0 && (
//         <section className="mt-10">
//           <div className="mb-5">
//             <p
//               className="
//                 text-xs
//                 font-bold
//                 uppercase
//                 tracking-[0.14em]
//                 text-[#410102]
//               "
//             >
//               Explore More
//             </p>

//             <h2
//               className="
//                 mt-1
//                 text-2xl
//                 font-black
//                 text-slate-900
//               "
//             >
//               Similar Products
//             </h2>
//           </div>

//           <div
//             className="
//               grid
//               grid-cols-2
//               gap-3
//               sm:gap-4
//               md:grid-cols-3
//               lg:grid-cols-4
//             "
//           >
//             {similarProducts
//               .slice(0, 4)
//               .map(
//                 (
//                   similarProduct
//                 ) => (
//                   <ProductCard
//                     key={
//                       similarProduct.id
//                     }
//                     product={
//                       similarProduct
//                     }
//                     onView={
//                       onViewProduct
//                     }
//                   />
//                 )
//               )}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }