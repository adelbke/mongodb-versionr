<div align="center">
  <h1>MongoDB Versionr</h1>

Track Changes in your MongoDB Collections.

</div>

## Description

MongoDB versionr can track changes in your collection using the [Change streams API](https://www.mongodb.com/docs/manual/changeStreams/#change-streams) it reliably writes these changes to Another collection of your choice that would contain history changes.

This library can be used as both a library relying on concurrency to perform it's task or as an independent server dedicated to tracking changes.

### Motivation

Data versioning is important for Data in Databases and many examples of this importance have been demonstrated on outage reports by large companies.

- [Amazon ELB Service Event](https://aws.amazon.com/message/680587/)
- [Github Downtime Post Incident Analysis](https://github.blog/2018-10-30-oct21-post-incident-analysis/)

Currently, The solutions available to track data changes in databases is mainly focused on relational databases with principles set by [noms](https://github.com/attic-labs/noms) And now improved and implemented by [dolt](https://github.com/dolthub/dolt) Many solutions exist for relational databases for data versioning

On the other hand the solutions for "change-tracking" in mongodb are limitted to Mongoose Plugins which is a MongoDB wrapper and these libraries rely on the `schema.pre()` function in Mongoose in order to intervene Mid request and handle versioning. There are disadvantages to this approach.

- Projects that use the MongoDB driver directly Cannot benefit from this
- If an external change (from another instance or service) occurs in the database it is missed when using this Approach

#### Advantages to using the Change Streams API

- Tracking ALL the changes occuring in the collection regardless from where the query comes from.
- The program can be ran both as a Server or a library. In both cases when the program is running change detection Works !

### Tech Stack used

- Pure Typescript compiled using the default compiler
- TSDX for setting up the development environement of the library

### Dependencies

- rxjs to manage the PUB-SUB event mechanism
- mongodb Nodejs Driver

### Status

The project is still in development, any contribution and discussion is welcome and Highly appreciated (Changelog)[changelog.md]



# Installation
TBD

# Usage
TBD

# Known issues
TBD

# Getting help
TBD

# Getting involved

Currently trying to setup an initial structure to the Project. Setting up the main organization and code pieces. There's a more detailed [TODO](#todo) below

You can Open issues in using the Github Issue Tracker and open a PR that will be reviewed. OR you can contact me directly to discuss your contribution for now [adelbouhraoua23@gmail.com](mailto:adelbouhraoua23@gmail.com) 

### TODO

- Prepare an init state plan.
  - Load all data in collection to history.
  - Check if history is already populated and adjust the gaps.
- Prepare a fallback state that makes sure if the process is dies. The versionr would pick-up the changes that occured during downtime
- Define Clearly the structure of a "history" entry in the Change Tracker
#### Someday TODOs
- Add custom handlers that can be defined by the user ?

# Credits and references

Insprations:
1. [Dolt](https://github.com/dolthub/dolt) A Git-like style relational database
2. [MongoDB Versioning Pattern](https://www.mongodb.com/blog/post/building-with-patterns-the-document-versioning-pattern) A pattern described by the MongoDB Team in order to setup versioning
