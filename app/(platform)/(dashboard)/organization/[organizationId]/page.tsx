"use client";

import React from "react";

const OrganizationIdPage = () => {
  console.log("I am looged in the browser");
  return (
    <div>
      <form>
        <input
          id="title"
          name="title"
          required
          placeholder="Enter a border title"
          className="border-black border p-1"
        />
      </form>
    </div>
  );
};

export default OrganizationIdPage;
