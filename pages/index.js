import Main from "@component/Main";
import MainLayout from "@component/MainLayout";

const Home = () => {
  return (
    <>
      <Main />
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
