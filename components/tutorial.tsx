// components/Tutorial.js
"use client";

import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";
import { useMountedState } from "react-use";

export const Tutorial = ({run}: {run: boolean}) => {
  const isMounted = useMountedState();
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isMounted || !isClient) {
    return null
  }

  const steps = [
    {
      target: ".step-1",
      content: "Aqui você consegue ver todas as informações de forma resumida.",
      skip: false
    },
    {
      target: ".step-2",
      content: "Aqui você consegue ver o gráfico de renda e despesas.",
      skip: false
    },
    {
      target: ".step-3",
      content: "Aqui você consegue ver o gráfico de categorias.",
      skip: false
    }
  ];

  return (
    <Joyride
      steps={steps}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Próximo",
        next: "Próximo",
        skip: "Pular",
        nextLabelWithProgress:  'Proxímo ({step} de {steps})',
      }}
      floaterProps={{
        autoOpen: true,
      }}
      callback={(data) => {
        if (data.status === "finished" && data.type === "tour:end") {
          console.log("Tutorial finalizado");
        }
      }}
      disableOverlay={false}
      disableCloseOnEsc={true}
      hideCloseButton={true}
      run={run}
      continuous={true}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={false}
    />
  );
};

export default Tutorial;
