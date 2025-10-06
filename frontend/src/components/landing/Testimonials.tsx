import React from 'react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      text: "I was completely lost after my surgery claim was denied. AppealMed's AI wrote an appeal that was better than anything I could have managed. It was approved in two weeks!",
      author: "Jessica S.",
      role: "Patient, California",
      avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=JS"
    },
    {
      text: "The process was so fast and intuitive. Uploading the documents was easy, and the generated letter was perfect. This service is a game-changer for anyone fighting an insurance company.",
      author: "David T.",
      role: "Caregiver, Florida",
      avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=DT"
    },
    {
      text: "As a healthcare advocate, I recommend AppealMed to all my clients. It saves them time, money, and an incredible amount of stress. The accuracy is impressive.",
      author: "Maria K.",
      role: "Healthcare Advocate, Texas",
      avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=MK"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Trusted by Patients Across the Country</h2>
          <p className="mt-4 text-lg text-gray-600">Don't just take our word for it. Here's what our users are saying.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
              <p className="text-gray-600">"{testimonial.text}"</p>
              <div className="mt-4 flex items-center">
                <img className="w-12 h-12 rounded-full" src={testimonial.avatar} alt="User" />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
