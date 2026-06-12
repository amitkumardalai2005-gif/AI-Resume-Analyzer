import { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Paper,
  TextField,
} from "@mui/material";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const [matchScore, setMatchScore] =
    useState<number | null>(null);

  const [matchedSkills, setMatchedSkills] =
    useState<string[]>([]);

  const [missingSkills, setMissingSkills] =
    useState<string[]>([]);

  const [suggestions, setSuggestions] =
    useState<string[]>([]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      alert("Select a resume");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "job_description",
      jobDescription
    );

    try {
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData
      );

      setMatchScore(
        response.data.match_score
      );

      setMatchedSkills(
        response.data.matched_skills
      );

      setMissingSkills(
        response.data.missing_skills
      );

      setSuggestions(
        response.data.suggestions
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
        >
          AI Resume Analyzer
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Paste Job Description"
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(
              e.target.value
            )
          }
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          component="label"
        >
          Select Resume
          <input
            hidden
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={analyzeResume}
        >
          Analyze Resume
        </Button>

        {matchScore !== null && (
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="h5">
              Match Score: {matchScore}%
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Matched Skills:
            </Typography>

            <ul>
              {matchedSkills.map(
                (skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                )
              )}
            </ul>

            <Typography sx={{ mt: 2 }}>
              Missing Skills:
            </Typography>

            <ul>
              {missingSkills.map(
                (skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                )
              )}
            </ul>

            <Typography sx={{ mt: 2 }}>
              Suggestions:
            </Typography>

            <ul>
              {suggestions.map(
                (suggestion, index) => (
                  <li key={index}>
                    {suggestion}
                  </li>
                )
              )}
            </ul>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default App;