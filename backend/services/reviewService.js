
class ReviewFacade {
    static makeReview(user,title, artist_name, description, rating){
        return;
    }
}


class ReviewFactory{
    static createReview(title, artist_name, description, rating){
        const review = {
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