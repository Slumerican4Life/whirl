
import React from 'react';
import { Mail, Clock, HelpCircle, MessageSquare } from 'lucide-react';
import NavBar from '@/components/NavBar';
import AdSenseUnit from '@/components/AdSenseUnit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ADS_CLIENT_ID = "ca-pub-5650237599652350";

const Contact = () => {
  const faqs = [
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond to support emails within 24 hours during business hours (Monday-Friday, 9 AM - 6 PM EST)."
    },
    {
      question: "What information should I include in my support request?",
      answer: "Please include your username, a detailed description of the issue, and any error messages you've encountered. Screenshots are also helpful!"
    },
    {
      question: "Can I get help with video uploads?",
      answer: "Absolutely! Our support team can help with upload issues, video processing problems, and technical difficulties."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Please email us with the specific video or content details, and we'll review it promptly according to our community guidelines."
    }
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg text-white">
      <NavBar />
      
      {/* Header Ad Banner */}
      <div className="container mx-auto px-4 py-2 text-center">
        <AdSenseUnit
          client={ADS_CLIENT_ID}
          slot="6714233499"
          format="auto"
          responsive="true"
          comment="contact-page-header-banner"
          className="min-h-[50px] md:min-h-[90px]"
        />
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row md:space-x-6">
        {/* Left Sidebar Ad (Desktop Only) */}
        <aside className="hidden md:block w-1/4 p-4">
          <div className="sticky top-20">
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="7994098522"
              format="auto"
              responsive="true"
              comment="contact-page-left-sidebar"
              className="min-h-[250px]"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto md:mx-0">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-whirl-purple to-whirl-pink text-transparent bg-clip-text mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Need help? Have questions? We're here to support you on your Whirl-Win journey.
            </p>
          </div>

          {/* Primary Contact Information */}
          <Card className="bg-gray-900/80 border-gray-700 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                <Mail className="w-6 h-6 text-purple-400" />
                Get Support
              </CardTitle>
              <CardDescription className="text-gray-300">
                Our dedicated support team is ready to help
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <a 
                  href="mailto:whirlwin.supp@gmail.com"
                  className="inline-flex items-center gap-2 text-2xl font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                  whirlwin.supp@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300 mb-4">
                <Clock className="w-5 h-5" />
                <span>Response time: Within 24 hours</span>
              </div>
              <Button 
                onClick={() => window.location.href = 'mailto:whirlwin.supp@gmail.com'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Business Hours & Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-3">
                  Try our AI assistant Lyra for instant help with common questions!
                </p>
                <p className="text-sm text-gray-400">
                  Look for the purple chat bubble in the bottom-right corner of any page.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* In-Content Multiplex Ad */}
          <div className="my-8 text-center">
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="8238475251"
              format="autorelaxed"
              comment="contact-page-multiplex"
              className="min-h-[250px]"
            />
          </div>

          {/* FAQ Section */}
          <Card className="bg-gray-900/80 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-gray-300">
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-700 last:border-b-0 pb-4 last:pb-0">
                    <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What We Can Help With */}
          <Card className="bg-gray-900/80 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">What We Can Help With</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h4 className="text-purple-400 font-semibold mb-2">Technical Support</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Video upload issues</li>
                    <li>• Account access problems</li>
                    <li>• Browser compatibility</li>
                    <li>• Performance issues</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">Account & Billing</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Token purchase issues</li>
                    <li>• Payment problems</li>
                    <li>• Account settings</li>
                    <li>• Profile management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">Platform Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Battle mechanics</li>
                    <li>• Voting system</li>
                    <li>• Leaderboard questions</li>
                    <li>• Feature requests</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-pink-400 font-semibold mb-2">Community</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Content reporting</li>
                    <li>• Community guidelines</li>
                    <li>• Partnership inquiries</li>
                    <li>• General feedback</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Right Sidebar Ad (Desktop Only) */}
        <aside className="hidden md:block w-1/4 p-4">
          <div className="sticky top-20">
            <AdSenseUnit
              client={ADS_CLIENT_ID}
              slot="8430046943"
              format="auto"
              responsive="true"
              comment="contact-page-right-sidebar"
              className="min-h-[250px]"
            />
          </div>
        </aside>
      </div>

      {/* Footer Ad Banner */}
      <div className="container mx-auto px-4 py-2 mt-8 text-center">
        <AdSenseUnit
          client={ADS_CLIENT_ID}
          slot="5424609655"
          format="auto"
          responsive="true"
          comment="contact-page-footer-banner"
          className="min-h-[50px] md:min-h-[90px]"
        />
      </div>
    </div>
  );
};

export default Contact;
