class StatsObserver{
    static totalReviews = 0;
    static criticReviews = 0;
    static userReviews = 0;
    static update(review){
        this.totalReviews += 1;
        console.log(
            `Total Reviews: ${this.totalReviews}`
        );
        if (review.isCritic){
            this.criticReviews += 1;
            console.log(
                `Total Critic Reviews: ${this.criticReviews}`
            );}
        else{
            this.userReviews += 1;
            console.log(
                `Total User Reviews: ${this.userReviews}`
            );};
    }

}

module.exports = StatsObserver;