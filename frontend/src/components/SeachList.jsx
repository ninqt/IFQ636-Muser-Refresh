import CriticUserStrategy from "../strategies/CriticUserStr";
import NormalUserStrategy from "../strategies/NormalUserStr";

const SearchList = ({ tasks }) => {
  return (
    <div>
      {tasks.map((task) => {
        const strategy = task.isCriticReview
          ? CriticUserStrategy
          : NormalUserStrategy;

        const style = strategy.style(task);

        return (
            <div key={task._id} className={style.card}>

            <div className="flex justify-between items-center">
              <h2 className="font-bold text-white text-2xl">
                {task.title}
              </h2>
              <span className="font-bold text-white text-2xl">
                {task.rating}/10
              </span>
            </div>

            <h1 className="text-white text-1xl font-bold">
              {task.artist_name}
            </h1>

            <p className="text-white">{task.description}</p>

          <div className="flex items-center gap-2">
            <p className="text-white">
             {task.userId.name}
            </p>

          {style.badge && (
            <span className="bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">
              {style.badge}
            </span>
          )}
          </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchList;