import StatsObserver from "./StatsObserver.js";
import LoggingObserver from "./LoggingObserver.js";
import { ReviewObserver } from "../services/reviewService.js";

class RegisterObservers{
    static subscribeAll(){
        ReviewObserver.subscribe(StatsObserver);
        ReviewObserver.subscribe(LoggingObserver);
    }
}

export default RegisterObservers;