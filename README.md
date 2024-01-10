**Leveraging AI in Functional Testing: A Technical Tutorial for API Testing**
-----------------------------------------------------------------------------

  

Hello!

I'm **Ivano**, from [**TR Seeds**](https://trseeds.co.uk/), where we specialise in delivering tailored solutions for the software industry.

As part of our day-to-day tasks, we perform extensive testing on APIs for various clients. With the emergence of artificial intelligence (AI), we became curious about optimizing our processes without sacrificing control over them.

During our exploration, we discovered Generative Pretrained Transformers (GPTs) excel at producing artifacts such as unit tests and Behavior-Driven Development (BDD) feature files – precisely what we needed!

In this tutorial, I'll demonstrate how leveraging AI can expedite the creation of functional tests using C# and SpecFlow for a particular endpoint: '_GET /api/books_'. This endpoint simply retrieves a list of all books available on the platform.

Keep in mind that my goal here is to provide a straightforward example, so I intentionally kept the complexity minimal.

### **Introduction**

Functional testing is a critical part of software development, ensuring that applications behave as expected under various conditions. However, traditional manual testing methods can be time-consuming and error-prone. Enter artificial intelligence (AI), which has the potential to revolutionize the way we approach functional testing.

In this tutorial, we'll explore how AI can be applied to API testing, one specific area of functional testing. We'll cover the benefits of using AI for API testing, as well as best practices for getting started. By the end of this tutorial, you'll have a solid understanding of how to use AI to automate and optimize your API testing efforts

### **Step 1:** Obtain the Swagger Definition

To begin, access the Swagger definition for our sample application located at [http://localhost:3000/api-docs/swagger.json](http://localhost:3000/api-docs/swagger.json). Open the link using tools like Visual Studio Code or any preferred code editor. Familiarize yourself with the Swagger's JSON file and locate the desired endpoint definition.

Below is the relevant endpoint definition extracted from the Swagger documentation:

    Copy to Clipboard"/api/books": {
      "get": {
        "summary": "Get a list of all books",
        "tags": [
          "Book"
        ],
        "responses": {
          "200": {
            "description": "A list of books",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Book"
                  }
                }
              }
            }
          }
        }
      }
    }

  

### **Step 2:** Creating the Prompt

In this step, we will craft a straightforward prompt utilizing the discovered endpoint definition from the OpenAPI/Swagger document.

Just prompt the following in the GPT you're using:

    Copy to ClipboardGenerate a SpecFlow functional test for the following endpoint:
    
    "/api/books": {
      "get": {
        "summary": "Get a list of all books",
        "tags": [
          "Book"
        ],
        "responses": {
          "200": {
            "description": "A list of books",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Book"
                  }
                }
              }
            }
          }
        }
      }
    }

Executing this prompt results in various outputs based on the Large Language Model (LLM) utilized. While some may produce highly detailed responses, others might provide minimalistic ones. Nevertheless, these models excel at generating contextually accurate information.

An exemplary output could look as follows:

    Copy to ClipboardFeature: Books API
    
    Scenario: Get a list of all books
      Given I have access to the Books API
      When I send a GET request to "/api/books"
      Then the response status code should be 200
      And the response content type should be "application/json"
      And the response body should contain valid book objects in JSON array format
    

This feature file effectively outlines the expected behavior of the API, ensuring comprehension among both technical and non-technical stakeholders alike. By employing such prompts, we efficiently obtain SpecFlow feature files without exerting excessive effort.

Next, we shall proceed to the subsequent stage.

  

### **Step 3:** Test Case Generation (alias the Step Definition)

Next, since we're happy with the feature file and how it suggests testing our endpoint, we need to implement the technicalities: our step definition file.

This file, the step definition, contains the actual code that performs the testing.

Suppose we're using NUnit as our testing framework, along with RestSharp for making API calls, and FluentAssertions for our validations. To add complexity, let's assume we've created a wrapper around RestSharp to manage our API calls. In that case, here's how we can generate the code for ourselves:

    Copy to ClipboardGenerate the C# SpecFlow step definition for the following Feature
    Use NUnit, RestSharp and FluentAssertions
    We use a class that wraps the api calls: ApiWrapper wrapper = new ApiWrapper(baseUrl);
    and here an example of get call: var items = wrapper.Get<List<Item>>("api/items");
    
    Feature: Books API
    
    Scenario: Get a list of all books
    Given I have access to the Books API
    When I send a GET request to "/api/books"
    Then the response status code should be 200
    And the response content type should be "application/json"
    And the response body should contain valid book objects in JSON array format

And here's the AI output:

    Copy to Clipboardusing TechTalk.SpecFlow;
    using NUnit.Framework;
    using RestSharp;
    using System.Collections.Generic;
    using Newtonsoft.Json;
    using FluentAssertions;
    
    namespace BooksApiTests
    {
        [Binding]
        public class BooksAPISteps
        {
            private readonly ApiWrapper _wrapper;
            private IRestResponse _response;
            private List<Book> _books;
    
            public BooksAPISteps()
            {
                _wrapper = new ApiWrapper("<BASE_URL>"); // replace <BASE_URL> with actual base URL
            }
    
            [Given(@"I have access to the Books API")]
            public void GivenIHaveAccessToTheBooksAPI()
            {
                // No implementation needed as it's just a precondition
            }
    
            [When(@"I send a GET request to ""(.*)""")]
            public void WhenISendAGETRequestTo(string endpoint)
            {
                _response = _wrapper.Get<object>(endpoint);
            }
    
            [Then(@"the response status code should be (.*)")]
            public void ThenTheResponseStatusCodeShouldBe(int expectedStatuscode)
            {
                _response.StatusCode.Should().Be((System.Net.HttpStatusCode)expectedStatuscode);
            }
    
            [Then(@"the response content type should be ""(.*)""")]
            public void ThenTheResponseContentTypeShouldBe(string expectedContentType)
            {
                Assert.AreEqual(expectedContentType, _response.ContentType);
            }
    
            [Then(@"the response body should contain valid book objects in JSON array format")]
            public void ThenTheResponseBodyShouldContainValidBookObjectsInJSONArrayFormat()
            {
                if (_response.IsSuccessful && !string.IsNullOrEmpty(_response.Content))
                {
                    _books = JsonConvert.DeserializeObject<List<Book>>(_response.Content);
                    
                    foreach (var book in _books)
                    {
                        book.Should().NotBeNull();
                        book.Title.Should().BeOfType<string>();
                        book.Author.Should().BeOfType<string>();
                    }
                }
                else
                {
                    Assert.Fail("Invalid or empty response received.");
                }
            }
        }
    }

  

**Isn't that amazing?**

All you now have to do is create the feature file inside your project, with the one generated here.

Create the step definition file, paste the code, and make any necessary adjustments depending on the project code complexity.

Typically, this process takes only about ten minutes because the code produced in this manner is nearly production-ready.

  

**Conclusion:**

Writing functional tests using SpecFlow for your API endpoints offers multiple benefits, such as detecting bugs early and serving as living documentation for your API. This approach effectively bridges the communication gap between technical and non-technical stakeholders by providing a clear understanding of the API's behavior.

Moreover, this brief tutorial demonstrates how to leverage advanced language processing technology to expedite your testing process.

By utilising tools like Mistral Instruct, DeepSeek Coder, Notux, Google Gemini API, Bing, ChatGPT, and others, you can significantly enhance productivity while ensuring high-quality test coverage.

  

**For More:**

To stay updated on emerging trends and best practices related to software testing and quality assurance, keep an eye out for future articles. Wishing you successful testing endeavors!

If improving efficiency, reducing costs, or enhancing quality are among your priorities, consider partnering with TR Seeds. With their extensive experience, they can assist you in achieving these objectives and much more. Explore what TR Seeds has to offer at [https://trseeds.co.uk](https://trseeds.co.uk/).

  

Happy testing!

Ivano
