<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/KristabBhattarai/OrderIt">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Order It</h3>

  <p align="center">
    Order It is a discord bot to run a shops in discord with additional features like food ordering roleplays.
    <br />
    <a href="https://kristab.gitbook.io/orderit-docs/change-logs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://discord.gg/ef7agGvEza">Support Server</a>
    &middot;
    <a href="https://github.com/KristabBhattarai/OrderIt/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/KristabBhattarai/OrderIt/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Order It is a versatile bot designed to help you seamlessly run your business on Discord. With a range of features such as creating your own shop, ordering, selling, buying, hiring, and managing advertisements with customized questions, this bot is the ultimate solution for your business needs.

With Order It new feature you can now order virtual food for yourself in the server with the very least restriction.
Troll orders are accepted but it should not break our rules.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![MongoDB][MongoDB.com]][MongoDB-url]
* [![Node.js][Node.js]][Nodejs-url]
* Discord.js v13

  Note: This is a old discord.js version so many new feature is not available on this version.
  You can update it to latest version but it will break alot of code so, update "ONLY" if you know how to do coding and have some discord.js knowledge.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get the project up and running, you just need to follow below steps.

### Installation

_Below is the process on how to setup Order It and it's services_

1. Create a mongodb database and get it's uri.
2. Create a bot in discord developer portal and get it's token.
3. Get top.gg token and auth for vote message from your bot's top.gg profile
4. Change `.env.example.txt` file name to `.env`.
5. Enter all those data in `.env` file
   ```env
   PORT= #Port Number for the server to run on (Default will be 3000)
   mongoUri= #MongoDB URI for the database
   token= #Discord Bot Token for the bot to run
   topggtoken= #Top.gg Token
   topggauth= #Top.gg Authorization
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/KristabBhattarai/OrderIt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=KristabBhattarai/OrderIt" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Kristab Bhattarai - [@kristab](discordapp.com/users/598524997954306048) - kristab12345@gmail.com

Project Link: [https://github.com/KristabBhattarai/OrderIt](https://github.com/KristabBhattarai/OrderIt)

Support Server: [https://discord.gg/ef7agGvEza](https://discord.gg/ef7agGvEza)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)
* [Tomato6966 Discord.js Handler](https://github.com/Tomato6966/Discord-Js-Handler-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/KristabBhattarai/OrderIt.svg?style=for-the-badge
[contributors-url]: https://github.com/KristabBhattarai/OrderIt/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/KristabBhattarai/OrderIt.svg?style=for-the-badge
[forks-url]: https://github.com/KristabBhattarai/OrderIt/network/members
[stars-shield]: https://img.shields.io/github/stars/KristabBhattarai/OrderIt.svg?style=for-the-badge
[stars-url]: https://github.com/KristabBhattarai/OrderIt/stargazers
[issues-shield]: https://img.shields.io/github/issues/KristabBhattarai/OrderIt.svg?style=for-the-badge
[issues-url]: https://github.com/KristabBhattarai/OrderIt/issues
[license-shield]: https://img.shields.io/github/license/KristabBhattarai/OrderIt.svg?style=for-the-badge
[license-url]: https://github.com/KristabBhattarai/OrderIt/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/kristabbhattarai/
[MongoDB.com]: https://img.shields.io/badge/Mongodb-00684A?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com
[Node.js]: https://img.shields.io/badge/Node.js-00684A?style=for-the-badge&logo=node.js&logoColor=white
[Nodejs-url]: https://nodejs.org
