import BookmarkButton from "@/components/BookmarkButton";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Details = ({ author, detail }: { author: any; detail?: any }) => {
  const birthPlace = detail?.birth_place;
  const deathDate = detail?.death_date;
  const deathPlace = detail?.death_place;
  const subjects = Array.isArray(author.top_subjects)
    ? author.top_subjects.slice(0, 3).join(", ")
    : undefined;

  const formattedBirthDate = author.birth_date
    ? formatDateToTurkish(author.birth_date)
    : null;

  const formattedDeathDate = deathDate ? formatDateToTurkish(deathDate) : null;

  const summaryParts = [
    formattedBirthDate
      ? `${formattedBirthDate} tarihinde dünyaya gelmiştir.`
      : "",
    birthPlace
      ? `${birthPlace} kentinde doğmuş ve burada ilk yıllarını geçirmiştir.`
      : "",
    author.work_count
      ? `Yaşamı boyunca toplam ${author.work_count} eser kaleme alarak edebiyat dünyasına önemli katkılarda bulunmuştur.`
      : "",
    author.top_work
      ? `En çok tanınan eseri ise “${author.top_work}” olarak bilinmektedir.`
      : "",
    formattedDeathDate
      ? `${formattedDeathDate} tarihinde hayatını kaybetmiştir.`
      : "",
    deathPlace ? `Vefat ettiği yer: ${deathPlace}.` : "",
    subjects
      ? `Genellikle ${subjects} gibi konulara odaklanmış ve bu alanlarda eserler vermiştir.`
      : "",
  ];

  const summaryText = summaryParts.filter(Boolean).join(" ");

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.authorName}>{author.name}</Text>
        <View style={styles.bookmarkWrapper}>
          <BookmarkButton
            type="author"
            item={{
              id: author.id || author.authorId || author.key || author.name, // fallback olarak name
              name: author.name,
              birth_date: author.birth_date,
              top_work: author.top_work,
              work_count: author.work_count,
            }}
          />
        </View>
      </View>
      {summaryText ? (
        <Text style={styles.authorSummary}>{summaryText}</Text>
      ) : (
        <Text style={styles.authorSummary}>
          Yazar hakkında ayrıntılı bilgi bulunamadı.
        </Text>
      )}
    </View>
  );
};

function formatDateToTurkish(dateStr: string) {
  try {
    if (/^\d{4}$/.test(dateStr)) {
      return `${dateStr} yılı`;
    }
    const date = parseISO(dateStr);
    return format(date, "d MMMM yyyy", { locale: tr });
  } catch (e) {
    return dateStr;
  }
}

export default Details;

const styles = StyleSheet.create({
  detailsContainer: {
    paddingHorizontal:16,
    marginTop: 20,
    width: "100%",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0D8CF",
    paddingBottom: 8,
    marginBottom: 12,
  },
  authorName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6c584c",
    flex: 1,
  },
  authorSummary: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    textAlign: "left",
  },
  bookmarkWrapper: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
  },
});
