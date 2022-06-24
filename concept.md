Docker

- a container technology, for creating and managing containers

Image

- Template/blueprints for greating containers
- ~ class definition in OOP
- images are layer-based, built layers are cached
  - if a step is changed, only the ensuing steps are rebuilt
  - each step generates a new image (intermediate image)

Container

- a standardized **running** unit of software
- uses OS built-in(or emulated) container support
- ~ instances of a class in OOP

Virtual Machines

- pros: similar to container, provide separated env & config
- cons: OS is installed in every virtual machine, consume lots of resource, long boot time
