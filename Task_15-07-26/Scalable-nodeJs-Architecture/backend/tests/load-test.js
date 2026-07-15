const autocannon = require("autocannon");


const startTest = async () => {

    const result = await autocannon({

        url: "http://localhost:3000/api/users",

        connections: 1000,   // concurrent users

        duration: 60,        // seconds

        pipelining: 1

    });

    console.log(
        "Load Test Completed"
    );

    console.log(
        result
    );
};
startTest();