import JobForm from "../components/JobForm";

import JobTable from "../components/JobTable";

import { useJobs } from "../hooks/useJobs";

import ImageJobForm from "../components/ImageJobForm";


const Dashboard = () => {

  const {
    jobs,
    loading
  } = useJobs();

  
  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">

        Job Queue Dashboard

      </h1>

      <JobForm />

      <ImageJobForm />

      {
        loading

        ?

        <p className="mt-5">
          Loading jobs...
        </p>

        :

        <JobTable
          jobs={jobs}
        />

      }
    </div>

  );
};

export default Dashboard;