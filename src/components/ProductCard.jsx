import { ChevronRight } from "lucide-react";

/* =========================================================
   PRICE FORMAT
========================================================= */

const formatINR = (value) =>
  Number(value || 0).toLocaleString("en-IN");

/* =========================================================
   PRODUCT CARD
========================================================= */

export default function ProductCard({
  product,
  onView,
}) {
  const variants = Array.isArray(product?.variants)
    ? product.variants
    : [];

  /* =======================================================
     DEFAULT PRICE

     First size/variant price only.
     Do not calculate minimum price.
  ======================================================= */

  const defaultVariant =
    variants[0] || null;

  const price = Number(
    defaultVariant?.amount || 0
  );

  return (
    <article
      onClick={() => onView(product)}
      className="
        group
        flex
        h-full
        min-w-0
        cursor-pointer
        flex-col
        overflow-hidden

        rounded-[12px]
        border
        border-slate-200
        bg-white
        shadow-[0_2px_8px_rgba(0,0,0,0.05)]

        transition-all
        duration-300

        sm:rounded-[14px]

        lg:rounded-[16px]
        lg:hover:-translate-y-1
        lg:hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]
      "
    >
      {/* ===================================================
          PRODUCT IMAGE

          IMPORTANT:

          Mobile:
          compact card like your reference image.

          object-cover:
          image fills the complete image area.

          Tablet/Desktop:
          image height gradually increases.
      =================================================== */}

      <div
        className="
          relative
          h-[165px]
          w-full
          overflow-hidden
          bg-[#f7f7f7]

          min-[400px]:h-[180px]

          sm:h-[220px]

          md:h-[250px]

          lg:h-[290px]

          xl:h-[310px]
        "
      >
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={
              product?.name ||
              "Product"
            }
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              object-center

              transition-transform
              duration-500

              lg:group-hover:scale-[1.025]
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

              text-[11px]
              font-medium
              text-slate-400

              sm:text-xs
            "
          >
            No Image
          </div>
        )}
      </div>

      {/* ===================================================
          CARD CONTENT
      =================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col

          px-2.5
          pb-2.5
          pt-2.5

          sm:px-3
          sm:pb-3
          sm:pt-3

          lg:px-4
          lg:pb-4
          lg:pt-4
        "
      >
        {/* =================================================
            CATEGORY NAME
        ================================================= */}

        <p
          className="
            truncate

            text-[9px]
            font-extrabold
            uppercase
            leading-none
            tracking-[0.08em]
            text-[#410102]

            sm:text-[10px]

            lg:text-[11px]
          "
        >
          {product?.category_name ||
            "Product"}
        </p>

        {/* =================================================
            PRODUCT NAME

            No description below this.
        ================================================= */}

        <h3
          className="
            mt-1.5
            line-clamp-2

            min-h-[30px]

            text-[12px]
            font-bold
            leading-[15px]
            text-slate-900

            sm:min-h-[36px]
            sm:text-[13px]
            sm:leading-[18px]

            lg:text-[15px]
            lg:leading-5
          "
        >
          {product?.name}
        </h3>

        {/* =================================================
            PRICE
        ================================================= */}

        <div
          className="
            mt-2

            sm:mt-2.5

            lg:mt-3
          "
        >
          <span
            className="
              text-[16px]
              font-black
              leading-none
              text-slate-900

              sm:text-[17px]

              lg:text-xl
            "
          >
            ₹{formatINR(price)}
          </span>
        </div>

        {/* =================================================
            VIEW MORE

            Compact on mobile.
        ================================================= */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();

            onView(product);
          }}
          className="
            mt-2.5

            flex
            h-[32px]
            w-full
            items-center
            justify-center
            gap-1

            rounded-[8px]
            bg-[#410102]

            px-2

            text-[11px]
            font-bold
            leading-none
            text-white

            transition-colors
            duration-200

            hover:bg-[#c90069]

            sm:mt-3
            sm:h-[36px]
            sm:rounded-[9px]
            sm:text-xs

            lg:h-[40px]
            lg:rounded-[10px]
            lg:text-sm
          "
        >
          View More

          <ChevronRight
            className="
              h-3
              w-3

              sm:h-3.5
              sm:w-3.5

              lg:h-4
              lg:w-4
            "
          />
        </button>
      </div>
    </article>
  );
}


// import { ChevronRight } from "lucide-react";

// const formatINR = (value) =>
//   Number(value || 0).toLocaleString("en-IN");

// export default function ProductCard({
//   product,
//   onView,
// }) {
//   const variants = Array.isArray(product.variants)
//     ? product.variants
//     : [];

//   /*
//     IMPORTANT:
//     You asked for DEFAULT FIRST SIZE PRICE.

//     So do NOT calculate minimum price here.
//     We take variants[0].
//   */
//   const defaultVariant = variants[0] || null;

//   const price = Number(
//     defaultVariant?.amount || 0
//   );

//   return (
//     <article
//       onClick={() => onView(product)}
//       className="
//         group
//         flex
//         cursor-pointer
//         flex-col
//         overflow-hidden
//         rounded-[18px]
//         border
//         border-[#410102]/10
//         bg-white
//         shadow-sm
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:shadow-[0_12px_30px_rgba(238,2,126,0.10)]
//       "
//     >
//       {/* ===============================
//           PRODUCT IMAGE
//       =============================== */}

//       <div
//         className="
//           relative
//           aspect-[3/4]
//           w-full
//           overflow-hidden
//           bg-[#f6efef]
//         "
//       >
//         {product.image_url ? (
//           <img
//             src={product.image_url}
//             alt={product.name}
//             loading="lazy"
//             className="
//               h-full
//               w-full
//               object-cover
//               transition-transform
//               duration-500
//               group-hover:scale-[1.03]
//             "
//           />
//         ) : (
//           <div
//             className="
//               flex
//               h-full
//               items-center
//               justify-center
//               text-sm
//               font-medium
//               text-slate-400
//             "
//           >
//             No Image
//           </div>
//         )}
//       </div>

//       {/* ===============================
//           PRODUCT CONTENT
//       =============================== */}

//       <div className="flex flex-1 flex-col p-3 sm:p-4">
//         {/* CATEGORY NAME */}

//         <p
//           className="
//             text-[10px]
//             font-extrabold
//             uppercase
//             tracking-[0.12em]
//             text-[#410102]
//           "
//         >
//           {product.category_name || "Collection"}
//         </p>

//         {/* PRODUCT NAME */}

//         <h3
//           className="
//             mt-1
//             line-clamp-2
//             min-h-[40px]
//             text-sm
//             font-bold
//             leading-5
//             text-slate-900
//             sm:text-[15px]
//           "
//         >
//           {product.name}
//         </h3>

//         {/* DEFAULT FIRST SIZE PRICE */}

//         <div className="mt-2">
//           <span
//             className="
//               text-lg
//               font-black
//               text-slate-900
//             "
//           >
//             ₹{formatINR(price)}
//           </span>
//         </div>

//         {/* VIEW MORE */}

//         <button
//           type="button"
//           onClick={(event) => {
//             event.stopPropagation();
//             onView(product);
//           }}
//           className="
//             mt-4
//             flex
//             h-10
//             w-full
//             items-center
//             justify-center
//             gap-2
//             rounded-xl
//             bg-[#410102]
//             px-4
//             text-sm
//             font-bold
//             text-white
//             transition-all
//             duration-300
//             hover:bg-[#c90069]
//           "
//         >
//           View More

//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </article>
//   );
// }