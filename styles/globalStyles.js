import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: -200,
    padding: 20,
    backgroundColor: "#D8EFD3",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    opacity: 0.5,
    marginVertical: 8,
    backgroundColor: "#5CE1E6",
    borderRadius: 10,
    color: "black",
  },
  errorText: {
    color: "red",
  },
  image: {
    height: 200,
    width: 200,
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  view2: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  pressText: {
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "#5CE1E6",
    borderColor: "#B6C7AA",
    padding: 10,
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 150,
    width: "100%",
    backgroundColor: "#black",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo: {
    width: 100,
    height: 150,
  },
  menu: {
    fontSize: 18,
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: "#5CE1E6",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    color: "#000",
  },
});

export default globalStyles;
