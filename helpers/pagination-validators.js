const User = require('../models/User')

// VALIDATE PAGINATION DATA

const valUsersPage = async(pageSize,totalDocs,page)=>{

    page = Number(page)
    
    const PAGE_SIZE = pageSize
    
    const TOTAL_DOCS= totalDocs
    let totalPages = Math.ceil(TOTAL_DOCS / PAGE_SIZE)
    
    if(page > totalPages){
        page = totalPages
    }else{
        if(page < 1){
            page = 1
        }
    }

    return {
        page,
        totalPages
    };
}

module.exports = {
    valUsersPage
}