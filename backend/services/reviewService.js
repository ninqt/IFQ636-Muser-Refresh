
class ReviewFacade {
    static makeReivew(user,title, artist_name, description, rating){
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


