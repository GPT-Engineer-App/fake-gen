import React, { useState, useEffect } from "react";
import { Box, Heading, Input, Button, List, ListItem, ListIcon, VStack, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

import { FaPlay, FaPause } from "react-icons/fa";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const intervalIds = {};
    Object.keys(timers).forEach((key) => {
      if (timers[key]) {
        intervalIds[key] = setInterval(() => {
          console.log(`Timer for todo ${key} is running...`);
        }, 1000);
      } else if (intervalIds[key]) {
        clearInterval(intervalIds[key]);
      }
    });
    return () => {
      Object.values(intervalIds).forEach(clearInterval);
    };
  }, [timers]);
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();

  const handleInputChange = (e) => setInputValue(e.target.value);

  const toggleTimer = (index) => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      [index]: !prevTimers[index],
    }));
  };

  const addTodo = () => {
    if (inputValue.trim() === "") {
      toast({
        title: "No content",
        description: "Todo can't be empty",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const newTodo = { text: inputValue, isRunning: false };
    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <VStack p={8}>
      <Heading mb="8">Todo App</Heading>
      <HStack>
        <Input value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress} placeholder="Add a new task..." />
        <IconButton icon={<FaPlus />} onClick={addTodo} colorScheme="blue" aria-label="Add todo" />
      </HStack>
      <List spacing={3} my={5} w="100%">
        {todos.map((todo, index) => (
          <ListItem key={index} p={2} bg="gray.100" borderRadius="md">
            <HStack justify="space-between" spacing={4}>
              <Box>{todo.text}</Box>
              <Button leftIcon={timers[index] ? <FaPause /> : <FaPlay />} onClick={() => toggleTimer(index)} colorScheme={timers[index] ? "red" : "green"}>
                {timers[index] ? "Pause" : "Start"}
              </Button>
              <IconButton icon={<FaTrash />} onClick={() => deleteTodo(index)} colorScheme="red" aria-label="Delete todo" />
            </HStack>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default Index;
