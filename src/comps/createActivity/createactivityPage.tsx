import React, { useState,useEffect } from "react";
import { createActivity, ActivityField } from "@/utils/api/activity";
import { getLocation, LocationField } from "@/utils/api/location";


const Createactivity = () => {
  const [locations, setLocations] = useState<LocationField[]>([]);


  const [formData, setFormData] = useState<ActivityField>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    contact: "",
    user_count: 0,
    price: 0,
    user_property: "",
    remark: "",
    create_by: "",
    image_link: "",
    location_id: 0
  });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const locationRes = await getLocation({});

      if (locationRes?.success) {
        setLocations(locationRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching locations or roles:", error);
    }
  };

  fetchData();
}, []);





  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["user_count", "price", "location_id"].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock image upload (replace this with real upload logic if needed)
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image_link: fakeUrl
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, start_date, end_date, status, create_by, location_id, user_count } = formData;

    if (!title || !start_date || !end_date || !status || !create_by || !location_id || !user_count) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await createActivity(formData);
      if (response.success) {
        alert("Activity created successfully!!");
        setFormData({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          status: "",
          contact: "",
          user_count: 0,
          price: 0,
          user_property: "",
          remark: "",
          create_by: "",
          image_link: "",
          location_id: 0
        });
      } else {
        alert("An error while creating the activity.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error while submitting the data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f9f9ff] px-4 md:px-32 py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-12">
        <h1 className="text-3xl font-semibold  font-cherry text-center mb-8">Activity Information</h1>
        <form onSubmit={handleSubmit}>
          <section className="mb-8">
            <div className="grid gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter activity title"
                  className="rounded-full p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your activity"
                  className="h-24 rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user_count" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Participants
                </label>
                <input
                  type="number"
                  id="user_count"
                  name="user_count"
                  value={formData.user_count}
                  onChange={handleChange}
                  placeholder="Max number of participants"
                  min="0"
                  className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Cost to participate (0 for free)"
                  min="0"
                  className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="user_property" className="block text-sm font-medium text-gray-700 mb-1">
                Participant Requirements
              </label>
              <input
                id="user_property"
                name="user_property"
                value={formData.user_property}
                onChange={handleChange}
                className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
              />
            </div>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
  <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-1">
    Location
  </label>
  <select
    id="location_id"
    name="location_id"
    value={formData.location_id}
    onChange={handleChange}
    required
    className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
  >
    <option value="">-- Select Location --</option>
    {locations.map((loc) => (
      <option key={loc.location_id} value={loc.location_id}>
        {loc.location_name}
      </option>
    ))}
  </select>
</div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Information
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Phone number or email"
                  className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </section>

          <section className="mb-8">
          <div>
              <label htmlFor="create_by" className="block text-sm font-medium text-gray-700 mb-1">
                Created By
              </label>
              <input
                type="text"
                id="create_by"
                name="create_by"
                value={formData.create_by}
                onChange={handleChange}
                placeholder="Your name or organization"
                className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                required
              />
            </div>


            <div className="mt-4">
              <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                id="remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="Any additional notes or remarks"
                className="h-16 rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">-- Select Status --</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
            />
          </section>

          <div className="text-center mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-orange-300 font-bold text-xl hover:bg-orange-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createactivity;
