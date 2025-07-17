#!/bin/bash

kubectl port-forward service/node-todo-service 8000:8000 &
kubectl port-forward service/node-todo-service 9464:9464 &


