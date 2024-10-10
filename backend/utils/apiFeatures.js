class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    // Search Feature (Filter)
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                // mongo operators always starts with $ sign
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        
        // for check
        console.log(keyword);

        this.query = this.query.find({ ...keyword });
        return this;
    
    }

    filter(){
        const queryCopy = { ...this.queryStr }

        // for check
        console.log(queryCopy);

        //Removing Fields from the query
        const removeFields = ['keyword','limit','page']
        removeFields.forEach(el => delete queryCopy[el]);

        // for check
        console.log(queryCopy);

        // Advance filter for price, ratings
        /* stringify is a method used to convert a JavaScript object or value into a JSON (JavaScript Object Notation) string. 
        JSON is a lightweight data-interchange format that is easy for humans to read and write and easy 
        for machines to parse and generate. */
        let queryStr = JSON.stringify(queryCopy)

        // for check
        console.log(queryStr);

        queryStr = queryStr.replace(/\b(gt|gte|ly|lte)\b/g, match => `$${match}`)

        // convert JSON into Query
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resPerPage){
        // what is the current displaying page
        const currentPage = Number(this.queryStr.page) || 1;

        // skip means how many items that should have to skip until current page items
        const skip = resPerPage * (currentPage-1);

        // limit means limit the numberof items in one page to resPerPage
        this.query = this.query.limit(resPerPage).skip(skip);

        return this;
    }
}

module.exports = APIFeatures