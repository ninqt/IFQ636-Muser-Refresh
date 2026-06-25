
const Task = require('../models/Task');  
import LoggingObserver from '../observers/LoggingObserver';
import StatsObserver from '../observers/StatsObserver';

class ReviewFacade {
    static makeReview(user,title, artist_name, description, rating){
        const review = ReviewFactory.createReview(user.id,title,artist_name,description,rating);
        ReviewBuilder.buildReview(review,user);
        const task = await Task.create(review);
        ReviewObserver.notifyObservers(task); //Observers are notified with the task so they can track review id if needed
        return task;
    }
}


class ReviewFactory{
    static createReview(userId,title, artist_name, description, rating){
        const review = {
            userId:userId,
            title:title,
            artist_name:artist_name,
            description:description,
            rating:rating
        }
        return review;
    }
}


class ReviewBuilder{
    static buildReview(review,user){
        this.setCriticReview(review,user)
        this.setDateTime(review)
        this.setHighlightable(review)
    }
    static setCriticReview(review,user){
        review.isCriticReview = user.critic
    }
    static setDateTime(review){
        review.date = new Date().toLocaleDateString
        review.time = new Date().toLocaleTimeString
    }
    static setHighlightable(review){
        review.isHighlightable = (review.description.trim().split(/\s+/).length || 0) >= 50
    }
}

class ReviewObserver{
    static observers = [];

    static notifyObservers(review){
        this.observers.forEach(subscriber => {
            subscriber.update(review)
        })
    }
    static subscribe(subscriber){
        this.observers.push(subscriber)

    }
}

export class ReviewObserver {};