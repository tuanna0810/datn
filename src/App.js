import {
  Textarea,
  Button,
  Text,
  Flex,
  Spinner,
  Image,
  ChakraProvider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import React, { Component }  from 'react';
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState();
  const [error, setError] = useState();
  const listEmo = ["Disgust", "Enjoyment", "Sadness", "Fear", "Anger", "Other"];

  const handlePredict = async () => {
    if (input.length === 0) {
      setError("Please enter some text");
      setEmotion([]);
      setIsHighlighted(null);
      return;
    }
    setIsLoading(true);
    const emo = await axios
      // .get(`http://nmtuet.ddnsfree.com:9200/submit/${input}`)
      .get(`http://localhost:8083/submit/${input}`)
      .catch((e) => {
        setIsLoading(false);
      });
    setEmotion(emo.data.result);
    setIsLoading(false);
  };

  useEffect(() => {
    let maxValue = Math.max.apply(Math, emotion);
    setIsHighlighted(emotion.indexOf(maxValue));
  }, [emotion]);

  return (
    <ChakraProvider>
      <Flex h="100vh" alignItems="center" justifyContent="center" bg="#ffffff">
        <Flex
          bg="#ccccff"
          alignItems="center"
          justifyContent="flex-start"
          direction="column"
          p={6}
          borderRadius="16px"
          mx={10}
          h="60vh"
          w="600px"
        >
          <Text fontSize="3xl" fontWeight="semibold" color="black" mb={5}>
            Sentimental analysis
          </Text>
          <Textarea
            placeholder="Insert content here..."
            bg="#ccffff"
            color="black"
            w="550px"
            h="400px"
            border="none"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
          />
          <Text color="red.500" mt={3} fontWeight="semibold">
            {error}
          </Text>
          <Button
            background="#1de9b6"
            minW="300px"
            mt={6}
            borderRadius="50px"
            onClick={handlePredict}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" mr={2} /> Predicting...
              </>
            ) : (
              "Predict"
            )}
          </Button>
        </Flex>
        <Flex
          bg="#99ccff"
          alignItems="center"
          justifyContent="flex-start"
          direction="column"
          p={6}
          borderRadius="16px"
          mx={10}
          h="60vh"
          w="600px"
        >
          <Text fontSize="3xl" fontWeight="semibold" color="black" mb={8}>
            Result
          </Text>
          <Grid templateColumns="repeat(3, 2fr)" gap={6} w="100%">
            {listEmo.map((emo, index) => (
              <GridItem w="100%" key={index}>
                <Flex
                  flexDir="column"
                  alignItems="center"
                  justifyContent="center"
                  opacity={isHighlighted === index ? 1 : 0.5}
                >
                  <Image src={`/assets/${emo}.svg`} w="100px" h="100px" />
                  <Text
                    fontSize="25px"
                    fontWeight="semibold"
                    color="black"
                    mt={2}
                  >
                    {emo}
                  </Text>
                  {emotion[index] && <Text>{emotion[index]} %</Text>}
                </Flex>
              </GridItem>
            ))}
          </Grid>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
