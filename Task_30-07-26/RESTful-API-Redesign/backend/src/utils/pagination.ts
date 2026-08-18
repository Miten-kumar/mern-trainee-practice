export interface PaginationResult {

    page:number;

    limit:number;

    skip:number;

}


export const getPagination = (

    pageQuery?:string,

    limitQuery?:string

):PaginationResult=>{


    const page = Math.max(

        Number(pageQuery) || 1,

        1

    );

    const limit = Math.min(

        Math.max(

            Number(limitQuery) || 10,

            1
        ),

        100

    );

    const skip = (

        page - 1

    ) * limit;

    return {

        page,

        limit,

        skip

    };
};

export const getPaginationMeta = (

    page:number,

    limit:number,

    total:number

)=>{

    return {

        page,

        limit,

        total,

        totalPages:
        Math.ceil(total / limit),

        hasNextPage:
        page < Math.ceil(total / limit),

        hasPreviousPage:
        page > 1


    };

};