import Image from "next/image";

export default function Team(){
    return(
<section className="py-16 px-4 md:px-8 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A Team Creates <span className="text-yellow-400">Amazing</span> <br />
            Work For Your Business
          </h2>
          <p className="max-w-2xl mb-12">
            Circuit is flexible and affordable and offers you exceptional support to achieve your career goals.
            Circuit is a Global training provider based across the UK that specialises.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-teal-800 rounded-lg p-8">
              <div className="mb-4">
                <Image 
                  src="/images/images/happy-customers.png" alt="Happy Customers" 
                  width={100} 
                  height={100}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Happy Customers</h3>
              <p className="text-gray-300">
                Productive agents are happy agents. Give them all the support tools and
                information they need to best serve your customers.
              </p>
            </div>
            
            <div className="bg-teal-800 rounded-lg p-8">
              <div className="mb-4">
                <Image 
                  src="/images/images/best-integrations.png" alt="Best Integrations" 
                  width={100} 
                  height={100}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Integrations</h3>
              <p className="text-gray-300">
                Our software is powerful enough to handle the most complex business, yet
                flexible enough to scale with you as you grow.
              </p>
            </div>
            
            <div className="bg-teal-800 rounded-lg p-8">
              <div className="mb-4">
                <Image 
                  src="/images/images/grow-without-problems.png" alt="Grow Without Problems" 
                  width={100} 
                  height={100}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Grow Without Problems</h3>
              <p className="text-gray-300">
                With evaluating in depth variety of data sets and including the speed of tech
                adaptation we can build bridges between any companies and their customers.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}