import { IProduct } from "boundless-api-client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner
import ProductsList from "../components/ProductsList";
import MainLayout from "../layouts/Main";
import { apiClient } from "../lib/api";
import { makeAllMenus } from "../lib/menu";
import VerticalMenu from "../components/VerticalMenu";
import { IMenuItem } from "../@types/components";
import SwiperSlider from "../components/SwiperSlider";
import cliffImg from "../assets/bann1.jpg";
import cliff2Img from "../assets/bann2.jpg";
import CoverTextInCenter from "../components/CoverTextInCenter";
import bgImg from "../assets/promo.png";
import bgPortraitImg from "../assets/promo.png";
import ProductsSliderByQuery from "../components/ProductsSliderByQuery";
import { IBasicSettings } from "../@types/settings";

export default function IndexPage({
  products,
  mainMenu,
  footerMenu,
  basicSettings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust the timeout as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <ClipLoader color="teal" size={70} /> {/* React Spinner */}

      </div>
    );
  }

  return (
    <MainLayout
      mainMenu={mainMenu}
      footerMenu={footerMenu}
      basicSettings={basicSettings}
    >
      <div className="container">
        <MainPageSlider />
        <div className="row">
          <nav className="col-lg-3 d-none d-lg-block">
            {mainMenu && <VerticalMenu menuList={mainMenu} />}
          </nav>
          <div className="col-lg-9 col-md-12">
            <h1 className="page-heading page-heading_h1 page-heading_m-h1">
              KNAS & ESCCAY STORE
            </h1>
            <ProductsList products={products} query={{}} />
          </div>
        </div>
        <div className="container">
          <h2 className="page-heading page-heading_h1 page-heading_m-h1">
            KNAS & ESCCAY TECH TRADING:
          </h2>
        </div>
      </div>
      <CoverTextInCenter
        showChevronDown
        img={bgImg.src}
        imgPortrait={bgPortraitImg.src}
        content={{
          intro: "",
          head: "",
          subHead: "",
        }}
        shadow={{
          opacity: 0.5,
          backgroundColor: "#000",
        }}
        link={"http://google.com"}
      />
      <div className="container">
        <h2 className="page-heading page-heading_h1 page-heading_m-h1">
          Products carousel:
        </h2>
        <ProductsSliderByQuery
          query={{ collection: ["main-page"], sort: "in_collection" }}
          title={"Collection title"}
          wrapperClassName="page-block"
        />
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async () => {
  const categoryTree = await apiClient.catalog.getCategoryTree({
    menu: "category",
  });
  const { products } = await apiClient.catalog.getProducts({
    collection: ["main-page"],
    sort: "in_collection",
  });
  const basicSettings = (await apiClient.system.fetchSettings([
    "system.locale",
    "system.currency",
  ])) as IBasicSettings;

  const menus = makeAllMenus({ categoryTree });

  return {
    props: {
      products,
      basicSettings,
      ...menus,
    },
  };
};

interface IIndexPageProps {
  products: IProduct[];
  mainMenu: IMenuItem[];
  footerMenu: IMenuItem[];
  basicSettings: IBasicSettings;
}

function MainPageSlider() {
  const slides = [
    {
      img: cliffImg.src,
      link: "",
      caption:
        "Three things cannot be long hidden: The Sun, The Moon, and The Truth.",
      captionPosition: "center",
      useFilling: true,
      fillingColor: "#000000",
      fillingOpacity: 0.4,
    },
    {
      img: cliff2Img.src,
      link: "",
      caption: "Pray not for easy lives, pray to be stronger men.",
      captionPosition: null,
      useFilling: true,
      fillingColor: "#000000",
      fillingOpacity: 0.4,
    },
  ];

  return (
    <SwiperSlider
      showPrevNext
      roundCorners
      pagination="progressbar"
      size={"large"}
      slides={slides}
      className={"mb-4"}
    />
  );
}

const styles = {
  loaderContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#fff",
  },
};
