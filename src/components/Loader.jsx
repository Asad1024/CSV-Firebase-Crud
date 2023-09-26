import loader from "../assets/loader.svg"

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={loader} alt="" className="loader-image" />
    </div>
  );
}

export default Loader