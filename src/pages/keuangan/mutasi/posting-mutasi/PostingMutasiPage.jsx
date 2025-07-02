import React from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const PostingMutasiPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Posting Mutasi</h1>
        {/* Konten lainnya */}
      </div>
    </div>
  );
};

export default PostingMutasiPage;
