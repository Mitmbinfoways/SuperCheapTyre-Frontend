import TyreCard from './TyreCard';


const TyreGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 sm:gap-10 lg:gap-12">
      {products.map((product) => (
        <TyreCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default TyreGrid;
